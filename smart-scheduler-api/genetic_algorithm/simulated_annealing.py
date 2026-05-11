"""
Simulated Annealing Scheduler.

Encoding:
- A schedule solution is a list[int] where gene i is the chosen slot index for subjects[i].

Search strategy:
- Start from a random solution.
- At each iteration, generate ONE random neighbor by changing one random gene.
- Accept improvements always.
- Accept worse moves with probability exp(-Δcost / T).
- Temperature cools each iteration: T = T * alpha.

Parameters (defaults per spec):
- T = 1000.0
- alpha = 0.995
- T_min = 0.01
- max_iter = 10000

Time complexity:
- O(max_iter) fitness calls (plus initialization).
"""

from __future__ import annotations

import math
import random
from typing import Any, Dict, List, Tuple

from .base import BaseScheduler
from .fitness import calculate_fitness


class SimulatedAnnealingScheduler(BaseScheduler):
    def __init__(
        self,
        subjects: List[str],
        time_slots: List[str],
        constraints: Dict[str, List[str]],
        *,
        priorities: Dict[str, int] | None = None,
        additional_constraints: Dict[str, Any] | None = None,
        subject_details: Dict[str, Any] | None = None,
        T: float = 1000.0,
        alpha: float = 0.995,
        T_min: float = 0.01,
        max_iter: int = 10000,
    ):
        super().__init__(
            subjects,
            time_slots,
            constraints,
            priorities=priorities,
            additional_constraints=additional_constraints,
            subject_details=subject_details,
        )
        self.T = float(T)
        self.alpha = float(alpha)
        self.T_min = float(T_min)
        self.max_iter = int(max_iter)

    def _random_solution(self) -> List[int]:
        return [random.randint(0, self.num_slots - 1) for _ in range(self.num_subjects)]

    def _random_neighbor(self, solution: List[int]) -> List[int]:
        neighbor = solution.copy()
        i = random.randint(0, self.num_subjects - 1)  # AI_ALGORITHM
        new_slot = random.randint(0, self.num_slots - 1)
        neighbor[i] = new_slot
        return neighbor

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

    def _decode(self, best_individual: List[int]) -> List[dict]:
        return [
            {"subject": subject, "time": self.time_slots[best_individual[i]]}
            for i, subject in enumerate(self.subjects)
        ]

    def run(self) -> Tuple[List[dict], float, List[Dict[str, Any]]]:
        current = self._random_solution()
        current_cost = self._fitness(current)
        best = current
        best_cost = current_cost

        T = self.T
        convergence_sa: List[Dict[str, Any]] = []  # AI_REPORT

        for i in range(self.max_iter):  # AI_ALGORITHM
            if i % 100 == 0:
                convergence_sa.append({"iteration": i, "cost": float(current_cost)})  # AI_REPORT
            if T <= self.T_min:
                break

            candidate = self._random_neighbor(current)
            candidate_cost = self._fitness(candidate)

            delta = candidate_cost - current_cost
            if delta <= 0:
                current = candidate
                current_cost = candidate_cost
            else:
                # Accept worse with probability exp(-delta/T)
                p = math.exp(-delta / T)  # AI_ALGORITHM
                if random.random() < p:
                    current = candidate
                    current_cost = candidate_cost

            if current_cost < best_cost:
                best = current
                best_cost = current_cost

            T = T * self.alpha

        return self._decode(best), float(best_cost), convergence_sa

