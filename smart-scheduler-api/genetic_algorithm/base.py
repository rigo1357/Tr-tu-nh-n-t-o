"""
Base interface for schedule optimization algorithms.

All algorithms in this package share:
- Problem encoding: a solution/chromosome is a list[int] where each gene i is
  the index of the chosen slot for subjects[i].
- Objective: minimize the shared fitness/cost function in `fitness.calculate_fitness`.
"""

from __future__ import annotations

from typing import Any, Dict, List, Tuple


class BaseScheduler:
    def __init__(
        self,
        subjects: List[str],
        time_slots: List[str],
        constraints: Dict[str, List[str]],
        *,
        priorities: Dict[str, int] | None = None,
        additional_constraints: Dict[str, Any] | None = None,
        subject_details: Dict[str, Any] | None = None,
    ):
        self.subjects = subjects
        self.time_slots = time_slots
        self.constraints = constraints
        self.priorities = priorities or {}
        self.additional_constraints = additional_constraints or {}
        self.subject_details = subject_details or {}

        self.num_subjects = len(subjects)
        self.num_slots = len(time_slots)

    def run(self) -> Tuple[List[dict], float]:
        """Returns (decoded_schedule, best_cost)."""
        raise NotImplementedError

