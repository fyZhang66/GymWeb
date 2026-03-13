"""Main orchestrator: loads test plan, runs test cases via TinyFish, collects results."""

import json
import logging
import time
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from .config import AppConfig
from .goal_builder import build_goal
from .models import TestCase, TestCaseResult, TestRunSummary
from .result_formatter import format_result
from .tinyfish_client import TinyFishClient, TinyFishError

logger = logging.getLogger(__name__)


def load_test_plan(test_plan_path: str | Path) -> list[TestCase]:
    """Load all test cases from the test plan JSON file."""
    path = Path(test_plan_path)
    if not path.exists():
        raise FileNotFoundError(f"Test plan not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)

    return [TestCase(**tc) for tc in raw]


def run_single(
    test_case: TestCase,
    client: TinyFishClient,
    config: AppConfig,
    verbose: bool = False,
) -> TestCaseResult:
    """Build a goal, execute via TinyFish, format the result. Handles retries."""
    goal = build_goal(test_case, config)

    start_url = config.gymweb.base_url

    last_error: str | None = None
    for attempt in range(1, config.execution.retry_max + 1):
        logger.info(
            "Running %s (attempt %d/%d): %s",
            test_case.id,
            attempt,
            config.execution.retry_max,
            test_case.title,
        )

        t0 = time.monotonic()
        try:
            raw_result = client.run(
                url=start_url,
                goal=goal,
                mode=config.execution.mode,
                browser_profile=config.execution.browser_profile,
                timeout=config.execution.timeout,
                verbose=verbose,
            )
            elapsed_ms = int((time.monotonic() - t0) * 1000)

            result = format_result(
                test_case_id=test_case.id,
                title=test_case.title,
                goal_prompt=goal,
                raw_result=raw_result,
                execution_time_ms=elapsed_ms,
            )

            # If passed or we got a real (non-error) result, return it
            if result.status != "error":
                return result

            last_error = result.error
            logger.warning("Attempt %d for %s returned error status: %s", attempt, test_case.id, last_error)

        except TinyFishError as e:
            elapsed_ms = int((time.monotonic() - t0) * 1000)
            last_error = str(e)
            logger.warning("Attempt %d for %s failed: %s", attempt, test_case.id, e)
        except Exception as e:
            elapsed_ms = int((time.monotonic() - t0) * 1000)
            last_error = str(e)
            logger.exception("Unexpected error on attempt %d for %s", attempt, test_case.id)

    # All retries exhausted
    return format_result(
        test_case_id=test_case.id,
        title=test_case.title,
        goal_prompt=goal,
        raw_result=None,
        execution_time_ms=elapsed_ms,
        error=f"All {config.execution.retry_max} attempts failed. Last error: {last_error}",
    )


def run_all(
    test_cases: list[TestCase],
    client: TinyFishClient,
    config: AppConfig,
    test_case_ids: list[str] | None = None,
    verbose: bool = False,
) -> TestRunSummary:
    """Run all (or selected) test cases and produce a summary.

    Args:
        test_cases: Full list of test cases from the test plan.
        client: Configured TinyFish client.
        config: Application configuration.
        test_case_ids: If provided, only run these test case IDs.
        verbose: Enable verbose logging.

    Returns:
        A TestRunSummary with all results.
    """
    if test_case_ids:
        id_set = set(test_case_ids)
        selected = [tc for tc in test_cases if tc.id in id_set]
        missing = id_set - {tc.id for tc in selected}
        if missing:
            logger.warning("Test case IDs not found in plan: %s", missing)
    else:
        selected = test_cases

    run_id = f"tinyfish_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid4().hex[:8]}"
    results: list[TestCaseResult] = []

    print(f"\n{'#' * 60}")
    print(f"TinyFish Test Run: {run_id}")
    print(f"Running {len(selected)} test case(s)")
    print(f"Mode: {config.execution.mode} | Timeout: {config.execution.timeout}s")
    print(f"{'#' * 60}\n")

    for i, tc in enumerate(selected, start=1):
        print(f"[{i}/{len(selected)}] {tc.id}: {tc.title}")
        result = run_single(tc, client, config, verbose=verbose)
        results.append(result)

        status_icon = {"passed": "PASS", "failed": "FAIL", "error": "ERR "}[result.status]
        print(f"  -> [{status_icon}] {result.execution_time_ms}ms")
        if result.error:
            print(f"     Error: {result.error[:120]}")
        print()

    passed = sum(1 for r in results if r.status == "passed")
    failed = sum(1 for r in results if r.status == "failed")
    errors = sum(1 for r in results if r.status == "error")

    summary = TestRunSummary(
        run_id=run_id,
        total=len(results),
        passed=passed,
        failed=failed,
        errors=errors,
        results=results,
    )

    # Print summary
    print(f"{'#' * 60}")
    print("TEST SUMMARY")
    print(f"{'#' * 60}")
    print(f"Total: {summary.total} | Passed: {passed} | Failed: {failed} | Errors: {errors}")
    print("-" * 60)
    for r in results:
        status_icon = {"passed": "PASS", "failed": "FAIL", "error": "ERR "}[r.status]
        err = f" - {r.error[:80]}" if r.error else ""
        print(f"  [{status_icon}] {r.test_case_id}: {r.title}{err}")
    print(f"{'#' * 60}\n")

    return summary
