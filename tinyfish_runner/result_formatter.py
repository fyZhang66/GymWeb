"""Parses TinyFish API responses into standardized TestCaseResult objects."""

import json
import logging
import re
from typing import Any

from .models import AssertionResult, StepResult, TestCaseResult

logger = logging.getLogger(__name__)


def _extract_json(raw: Any) -> dict[str, Any] | None:
    """Extract a JSON dict from various TinyFish response formats.

    Strategies (in order):
    1. Already a dict with expected keys -> return directly
    2. String -> json.loads()
    3. String with markdown code block -> extract from ```json ... ```
    4. String with embedded JSON -> find first { to last } and parse
    """
    # Strategy 1: already a dict
    if isinstance(raw, dict):
        if "test_passed" in raw or "step_results" in raw:
            return raw
        # Maybe nested under a "result" key
        if "result" in raw:
            return _extract_json(raw["result"])
        # Maybe the raw dict itself is the result with different keys
        return raw

    if not isinstance(raw, str):
        return None

    text = raw.strip()

    # Strategy 2: direct JSON parse
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    # Strategy 3: markdown code block
    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?\s*```", text, re.DOTALL)
    if match:
        try:
            parsed = json.loads(match.group(1).strip())
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

    # Strategy 4: find first { to last }
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace > first_brace:
        try:
            parsed = json.loads(text[first_brace : last_brace + 1])
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

    return None


def _parse_step_results(raw_steps: list[dict[str, Any]]) -> tuple[list[StepResult], list[AssertionResult]]:
    """Parse raw step results into StepResult and AssertionResult lists."""
    steps: list[StepResult] = []
    assertions: list[AssertionResult] = []

    for item in raw_steps:
        step_index = item.get("step_number", item.get("step_index", 0))
        step_type = item.get("type", "action").lower()
        description = item.get("description", "")
        success = item.get("success", False)
        xpath = item.get("xpath")
        error = item.get("error")

        sr = StepResult(
            step_index=step_index,
            type="assertion" if step_type == "assertion" else "action",
            description=description,
            success=success,
            xpath=xpath,
            error=error,
        )
        steps.append(sr)

        if step_type == "assertion":
            assertions.append(
                AssertionResult(
                    step_index=step_index,
                    description=description,
                    passed=success,
                    xpath=xpath,
                    details=error,
                )
            )

    return steps, assertions


def format_result(
    test_case_id: str,
    title: str,
    goal_prompt: str,
    raw_result: Any,
    execution_time_ms: int,
    error: str | None = None,
) -> TestCaseResult:
    """Convert a raw TinyFish response into a TestCaseResult.

    Args:
        test_case_id: ID of the test case (e.g., "TC001").
        title: Title of the test case.
        goal_prompt: The goal prompt sent to TinyFish.
        raw_result: Raw result from TinyFish API.
        execution_time_ms: Execution time in milliseconds.
        error: Error message if the run failed before getting a result.

    Returns:
        A populated TestCaseResult.
    """
    if error and raw_result is None:
        return TestCaseResult(
            test_case_id=test_case_id,
            title=title,
            status="error",
            execution_time_ms=execution_time_ms,
            goal_prompt=goal_prompt,
            error=error,
            raw_tinyfish_result=None,
        )

    parsed = _extract_json(raw_result)
    if parsed is None:
        logger.warning("Could not parse TinyFish result for %s", test_case_id)
        return TestCaseResult(
            test_case_id=test_case_id,
            title=title,
            status="error",
            execution_time_ms=execution_time_ms,
            goal_prompt=goal_prompt,
            error="Failed to parse TinyFish result as JSON",
            raw_tinyfish_result=raw_result,
        )

    # Determine pass/fail
    test_passed = parsed.get("test_passed", False)
    tinyfish_status = parsed.get("status", "completed" if test_passed else "failed")

    # Parse step results
    raw_steps = parsed.get("step_results", [])
    steps, assertions = _parse_step_results(raw_steps)

    status = "passed" if test_passed else "failed"

    return TestCaseResult(
        test_case_id=test_case_id,
        title=title,
        status=status,
        tinyfish_status=str(tinyfish_status),
        execution_time_ms=execution_time_ms,
        goal_prompt=goal_prompt,
        steps=steps,
        assertions=assertions,
        raw_tinyfish_result=raw_result,
        error=parsed.get("error"),
    )
