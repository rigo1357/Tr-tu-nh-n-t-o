"""
Minimax + Alpha-Beta Pruning Scheduler (depth-limited).

This adapts the scheduling problem to a two-player adversarial game:
- MAX player (Scheduler): chooses a slot assignment that MINIMIZES total cost.
- MIN player (Adversary): chooses a slot assignment that MAXIMIZES total cost (worst-case interference).

Tree:
- Each ply assigns one subject's slot (partial chromosome).
- Terminal: depth limit reached OR all subjects assigned.
- Evaluation: completes any unassigned genes deterministically, then computes the shared fitness.

Feasibility notes:
- Full branching factor can be very large (|slots|^(2*depth)).
- To keep computation feasible, we use:
  - depth_limit = min(len(subjects), 6) (per spec)
  - max_branching cap (default 8) based on available slots ordering.

Time complexity (rough):
- O((max_branching)^(depth_limit)) evaluations with alpha-beta pruning in best cases.
"""

from __future__ import annotations

import random
from typing import Any, Dict, List, Tuple

from .base import BaseScheduler
from .fitness import calculate_fitness


class MinimaxScheduler(BaseScheduler):
    def __init__(
        self,
        subjects: List[str],
        time_slots: List[str],
        constraints: Dict[str, List[str]],
        *,
        priorities: Dict[str, int] | None = None,
        additional_constraints: Dict[str, Any] | None = None,
        subject_details: Dict[str, Any] | None = None,
        depth_limit: int = 6,
        max_branching: int = 8,
        seed: int = 0,
    ):
        super().__init__(
            subjects,
            time_slots,
            constraints,
            priorities=priorities,
            additional_constraints=additional_constraints,
            subject_details=subject_details,
        )
        self.depth_limit = min(int(depth_limit), self.num_subjects)
        self.max_branching = max(1, int(max_branching))
        self._rng = random.Random(seed)

        # Candidate slots ordering: available first, then the rest.
        available = list(self.additional_constraints.get("available_slots", []))
        available_set = set(available)
        ordered = available + [s for s in self.time_slots if s not in available_set]
        self._ordered_slot_indices = [self.time_slots.index(s) for s in ordered if s in self.time_slots]

    def _candidate_slot_indices(self) -> List[int]:
        # Deterministic branch cap (feasibility)
        return self._ordered_slot_indices[: min(self.max_branching, len(self._ordered_slot_indices))]

    def _complete_assignment(self, assignment: List[int]) -> List[int]:
        completed = assignment.copy()
        for i in range(self.num_subjects):
            if completed[i] == -1:
                completed[i] = self._rng.randint(0, self.num_slots - 1)  # AI_ALGORITHM
        return completed

    def _fitness(self, individual: List[int]) -> float:
        return calculate_fitness(  # AI_ALGORITHM
            subjects=self.subjects,
            time_slots=self.time_slots,
            constraints=self.constraints,
            individual=individual,
            priorities=self.priorities,
            additional_constraints=self.additional_constraints,
            subject_details=self.subject_details,
        )

    def minimax(  # AI_ALGORITHM
        self,
        depth: int,
        subject_index: int,
        assignment: List[int],
        alpha: float,
        beta: float,
        is_maximizing: bool,
    ) -> float:
        # Terminal: depth limit or all subjects assigned.
        if depth >= self.depth_limit or subject_index >= self.num_subjects:  # AI_ALGORITHM
            completed = self._complete_assignment(assignment)
            return self._fitness(completed)

        candidates = self._candidate_slot_indices()

        if is_maximizing:
            value = float("inf")
            for slot_idx in candidates:
                assignment[subject_index] = slot_idx
                value = min(
                    value,
                    self.minimax(depth + 1, subject_index + 1, assignment, alpha, beta, False),
                )
                beta = min(beta, value)
                if beta <= alpha:
                    break
            assignment[subject_index] = -1
            return value
        else:
            value = float("-inf")
            for slot_idx in candidates:
                assignment[subject_index] = slot_idx
                value = max(
                    value,
                    self.minimax(depth + 1, subject_index + 1, assignment, alpha, beta, True),
                )
                alpha = max(alpha, value)
                if beta <= alpha:
                    break
            assignment[subject_index] = -1
            return value

    def _decode(self, best_individual: List[int]) -> List[dict]:
        return [
            {"subject": subject, "time": self.time_slots[best_individual[i]]}
            for i, subject in enumerate(self.subjects)
        ]

    def run(self) -> Tuple[List[dict], float]:
        # Root: MAX chooses the slot for subject 0 that minimizes worst-case outcome.
        assignment = [-1] * self.num_subjects
        best_slot = None
        best_value = float("inf")

        for slot_idx in self._candidate_slot_indices():  # AI_ALGORITHM
            assignment[0] = slot_idx
            value = self.minimax(1, 1, assignment, alpha=float("-inf"), beta=float("inf"), is_maximizing=False)
            if value < best_value:
                best_value = value
                best_slot = slot_idx
        assignment[0] = best_slot if best_slot is not None else 0

        completed = self._complete_assignment(assignment)
        cost = self._fitness(completed)
        return self._decode(completed), float(cost)

