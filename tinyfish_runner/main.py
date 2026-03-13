"""CLI entry point for the TinyFish test runner."""

import argparse
import json
import logging
import sys
from pathlib import Path

from .config import load_config
from .runner import load_test_plan, run_all
from .tinyfish_client import TinyFishClient


def main() -> None:
    _pkg_dir = Path(__file__).resolve().parent

    parser = argparse.ArgumentParser(
        description="Run gym-web test plan via TinyFish API",
        prog="tinyfish_runner",
    )
    parser.add_argument(
        "--config",
        type=str,
        default=str(_pkg_dir / "config.yaml"),
        help="Path to config.yaml",
    )
    parser.add_argument(
        "--test-plan",
        type=str,
        default=str(_pkg_dir.parent / "testsprite_tests" / "testsprite_frontend_test_plan.json"),
        help="Path to the test plan JSON file",
    )
    parser.add_argument(
        "--test-cases",
        nargs="*",
        default=None,
        help="Specific test case IDs to run (e.g., TC001 TC009). Runs all if omitted.",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output file path for results JSON. Auto-generated if omitted.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging",
    )

    args = parser.parse_args()

    # Configure logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    # Load config
    try:
        config = load_config(args.config)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    if not config.tinyfish.api_key:
        print(
            "Error: TinyFish API key not set. "
            "Set it in config.yaml or export TINYFISH_API_KEY.",
            file=sys.stderr,
        )
        sys.exit(1)

    # Load test plan
    try:
        test_cases = load_test_plan(args.test_plan)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"Loaded {len(test_cases)} test cases from {args.test_plan}")

    # Create client
    client = TinyFishClient(api_key=config.tinyfish.api_key)

    # Run
    summary = run_all(
        test_cases=test_cases,
        client=client,
        config=config,
        test_case_ids=args.test_cases,
        verbose=args.verbose,
    )

    # Save results
    output_path = args.output or f"tinyfish_results_{summary.run_id}.json"
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(summary.model_dump(), f, indent=2, default=str)

    print(f"Results saved to: {output_path}")


if __name__ == "__main__":
    main()
