"""Pydantic data models for test cases, results, and summaries."""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


# --- Input models (loaded from test plan JSON) ---


class TestStep(BaseModel):
    type: Literal["action", "assertion"]
    description: str


class TestCase(BaseModel):
    id: str
    title: str
    description: str
    category: str
    priority: str
    steps: list[TestStep]


# --- Result models ---


class StepResult(BaseModel):
    step_index: int
    type: Literal["action", "assertion"]
    description: str
    success: bool
    xpath: str | None = None
    error: str | None = None


class AssertionResult(BaseModel):
    step_index: int
    description: str
    passed: bool
    xpath: str | None = None
    details: str | None = None


class TestCaseResult(BaseModel):
    test_case_id: str
    title: str
    status: Literal["passed", "failed", "error"]
    tinyfish_status: str | None = None
    execution_time_ms: int = 0
    goal_prompt: str = ""
    steps: list[StepResult] = Field(default_factory=list)
    assertions: list[AssertionResult] = Field(default_factory=list)
    raw_tinyfish_result: Any = None
    error: str | None = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class TestRunSummary(BaseModel):
    run_id: str
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
    total: int = 0
    passed: int = 0
    failed: int = 0
    errors: int = 0
    results: list[TestCaseResult] = Field(default_factory=list)
