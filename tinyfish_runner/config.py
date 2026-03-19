"""Configuration loading from YAML with environment variable fallback."""

import os
from pathlib import Path
from typing import Literal

import yaml
from pydantic import BaseModel, Field, model_validator


class TinyFishConfig(BaseModel):
    api_key: str = ""


class GymWebConfig(BaseModel):
    base_url: str = "http://localhost:5173"
    login_user: str = ""
    login_password: str = ""


class ExecutionConfig(BaseModel):
    mode: Literal["sse", "async", "sync"] = "sse"
    concurrency: int = 3
    timeout: int = 300
    retry_max: int = 2
    browser_profile: str = "stealth"


class AppConfig(BaseModel):
    tinyfish: TinyFishConfig = Field(default_factory=TinyFishConfig)
    gymweb: GymWebConfig = Field(default_factory=GymWebConfig)
    execution: ExecutionConfig = Field(default_factory=ExecutionConfig)

    @model_validator(mode="after")
    def resolve_env_vars(self) -> "AppConfig":
        """Fall back to environment variables for sensitive fields."""
        if not self.tinyfish.api_key:
            self.tinyfish.api_key = os.environ.get("TINYFISH_API_KEY", "")
        if not self.gymweb.login_user:
            self.gymweb.login_user = os.environ.get("GYMWEB_LOGIN_USER", "")
        if not self.gymweb.login_password:
            self.gymweb.login_password = os.environ.get("GYMWEB_LOGIN_PASSWORD", "")
        return self

# dddd
def load_config(config_path: str | Path) -> AppConfig:
    """Load configuration from a YAML file with env var fallback."""
    config_path = Path(config_path)
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with open(config_path, "r", encoding="utf-8") as f:
        raw = yaml.safe_load(f) or {}

    return AppConfig(**raw)
