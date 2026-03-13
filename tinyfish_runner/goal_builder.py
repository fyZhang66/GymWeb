"""Converts test case steps into TinyFish goal prompts."""

import re

from .config import AppConfig
from .models import TestCase

GOAL_TEMPLATE = """\
You are testing the gym-web application.

TEST: {title}
PURPOSE: {description}

Starting URL: {start_url}

Execute these steps IN ORDER. For each step, record success/failure.
If a step fails, STOP and report which step failed.

STEPS:
{steps_block}

IMPORTANT: Return result as JSON with EXACTLY this structure:
{{
  "test_passed": true/false,
  "steps_completed": <number>,
  "total_steps": {total_steps},
  "step_results": [
    {{
      "step_number": 1,
      "type": "action" or "assertion",
      "description": "what was done/checked",
      "success": true/false,
      "xpath": "/html/body/..." or null,
      "error": null or "description"
    }}
  ],
  "final_url": "URL when test ended",
  "summary": "brief summary"
}}

For each step, include the XPath of the element you interacted with or checked.
Return ONLY the JSON object.\
"""


def _step_label(step_type: str) -> str:
    """Convert step type to a prompt label."""
    return "CHECK" if step_type == "assertion" else "ACTION"


def _substitute_credentials(text: str, config: AppConfig) -> str:
    """Replace credential placeholders with actual values from config."""
    text = text.replace("{{LOGIN_USER}}", config.gymweb.login_user)
    text = text.replace("{{LOGIN_PASSWORD}}", config.gymweb.login_password)
    return text


def _substitute_relative_urls(text: str, config: AppConfig) -> str:
    """Rewrite relative URL paths to absolute URLs using base_url from config.

    Converts patterns like 'Navigate to /login' into
    'Navigate to https://frontend-xxx.vercel.app/login'.
    """
    base = config.gymweb.base_url.rstrip("/")
    text = re.sub(
        r"Navigate to (/\S+)",
        lambda m: f"Navigate to {base}{m.group(1)}",
        text,
    )
    return text


def build_goal(test_case: TestCase, config: AppConfig) -> str:
    """Build a TinyFish goal prompt from a test case and config.

    Args:
        test_case: The test case to convert.
        config: Application config with credentials and URLs.

    Returns:
        A formatted goal prompt string.
    """
    start_url = config.gymweb.base_url

    # Build numbered step lines
    step_lines = []
    for i, step in enumerate(test_case.steps, start=1):
        label = _step_label(step.type)
        desc = _substitute_credentials(step.description, config)
        desc = _substitute_relative_urls(desc, config)
        step_lines.append(f"  Step {i} [{label}]: {desc}")

    steps_block = "\n".join(step_lines)

    goal = GOAL_TEMPLATE.format(
        title=test_case.title,
        description=test_case.description,
        start_url=start_url,
        steps_block=steps_block,
        total_steps=len(test_case.steps),
    )

    return goal
