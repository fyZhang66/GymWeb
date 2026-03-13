"""TinyFish API client supporting SSE, async, and sync execution modes."""

import json
import logging
import time
from typing import Any

import requests

logger = logging.getLogger(__name__)

TINYFISH_BASE_URL = "https://agent.tinyfish.ai"


class TinyFishError(Exception):
    """Raised when the TinyFish API returns an error."""


class TinyFishClient:
    """Client for the TinyFish automation API."""

    def __init__(self, api_key: str, base_url: str = TINYFISH_BASE_URL):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

    def _headers(self) -> dict[str, str]:
        return {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json",
        }

    def _build_payload(
        self,
        url: str,
        goal: str,
        browser_profile: str = "stealth",
        timeout: int = 300,
    ) -> dict[str, Any]:
        return {
            "url": url,
            "goal": goal,
            "browser_profile": browser_profile,
            "timeout": timeout,
        }

    # ------------------------------------------------------------------
    # SSE mode: POST /v1/automation/run-sse
    # ------------------------------------------------------------------

    def run_sse(
        self,
        url: str,
        goal: str,
        browser_profile: str = "stealth",
        timeout: int = 300,
        verbose: bool = False,
    ) -> dict[str, Any]:
        """Execute a TinyFish run using Server-Sent Events for progress streaming."""
        payload = self._build_payload(url, goal, browser_profile, timeout)
        endpoint = f"{self.base_url}/v1/automation/run-sse"
        logger.info("TinyFish SSE request: %s", endpoint)

        resp = requests.post(
            endpoint,
            json=payload,
            headers=self._headers(),
            stream=True,
            timeout=timeout + 30,  # extra buffer
        )
        resp.raise_for_status()

        result: dict[str, Any] = {}
        for line in resp.iter_lines(decode_unicode=True):
            if not line:
                continue
            if line.startswith("data: "):
                data_str = line[6:]
                try:
                    event = json.loads(data_str)
                except json.JSONDecodeError:
                    if verbose:
                        logger.debug("Non-JSON SSE line: %s", data_str)
                    continue

                event_type = event.get("type", event.get("event", ""))
                if verbose:
                    logger.info("SSE event [%s]: %s", event_type, json.dumps(event)[:200])

                if event_type in ("COMPLETE", "complete", "done"):
                    result = event.get("result", event.get("data", event))
                    break
                elif event_type in ("ERROR", "error"):
                    raise TinyFishError(
                        event.get("error", event.get("message", "Unknown SSE error"))
                    )

        if not result:
            raise TinyFishError("SSE stream ended without a COMPLETE event")
        return result

    # ------------------------------------------------------------------
    # Async mode: POST /v1/automation/run-async + GET /v1/runs/{id}
    # ------------------------------------------------------------------

    def run_async(
        self,
        url: str,
        goal: str,
        browser_profile: str = "stealth",
        timeout: int = 300,
        poll_interval: int = 5,
        verbose: bool = False,
    ) -> dict[str, Any]:
        """Submit a TinyFish run asynchronously and poll until completion."""
        payload = self._build_payload(url, goal, browser_profile, timeout)
        endpoint = f"{self.base_url}/v1/automation/run-async"
        logger.info("TinyFish async request: %s", endpoint)

        resp = requests.post(
            endpoint,
            json=payload,
            headers=self._headers(),
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()
        run_id = data.get("id") or data.get("run_id") or data.get("runId")
        if not run_id:
            raise TinyFishError(f"No run ID in async response: {data}")

        logger.info("TinyFish run submitted: %s", run_id)

        # Poll for completion
        poll_endpoint = f"{self.base_url}/v1/runs/{run_id}"
        deadline = time.monotonic() + timeout + 30
        while time.monotonic() < deadline:
            time.sleep(poll_interval)
            poll_resp = requests.get(
                poll_endpoint,
                headers=self._headers(),
                timeout=30,
            )
            poll_resp.raise_for_status()
            poll_data = poll_resp.json()

            status = poll_data.get("status", "").lower()
            if verbose:
                logger.info("Poll [%s]: status=%s", run_id, status)

            if status in ("complete", "completed", "done", "success"):
                return poll_data.get("result", poll_data)
            elif status in ("error", "failed"):
                raise TinyFishError(
                    poll_data.get("error", poll_data.get("message", f"Run {run_id} failed"))
                )

        raise TinyFishError(f"Run {run_id} timed out after {timeout}s")

    # ------------------------------------------------------------------
    # Sync mode: POST /v1/automation/run
    # ------------------------------------------------------------------

    def run_sync(
        self,
        url: str,
        goal: str,
        browser_profile: str = "stealth",
        timeout: int = 300,
        verbose: bool = False,
    ) -> dict[str, Any]:
        """Execute a TinyFish run synchronously (blocks until complete)."""
        payload = self._build_payload(url, goal, browser_profile, timeout)
        endpoint = f"{self.base_url}/v1/automation/run"
        logger.info("TinyFish sync request: %s", endpoint)

        resp = requests.post(
            endpoint,
            json=payload,
            headers=self._headers(),
            timeout=timeout + 30,
        )
        resp.raise_for_status()
        data = resp.json()

        if data.get("status", "").lower() in ("error", "failed"):
            raise TinyFishError(data.get("error", data.get("message", "Sync run failed")))

        return data.get("result", data)

    # ------------------------------------------------------------------
    # Unified entry point
    # ------------------------------------------------------------------

    def run(
        self,
        url: str,
        goal: str,
        mode: str = "sse",
        browser_profile: str = "stealth",
        timeout: int = 300,
        verbose: bool = False,
    ) -> dict[str, Any]:
        """Execute a TinyFish run using the specified mode."""
        if mode == "sse":
            return self.run_sse(url, goal, browser_profile, timeout, verbose)
        elif mode == "async":
            return self.run_async(url, goal, browser_profile, timeout, verbose=verbose)
        elif mode == "sync":
            return self.run_sync(url, goal, browser_profile, timeout, verbose)
        else:
            raise ValueError(f"Unknown execution mode: {mode!r}. Use 'sse', 'async', or 'sync'.")
