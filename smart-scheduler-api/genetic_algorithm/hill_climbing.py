"""
Steepest-Ascent Hill Climbing Scheduler.

Encoding:
- A schedule solution is a list[int] where gene i is the chosen slot index for subjects[i].

Search strategy:
- Start from a random solution.
- At each step, evaluate ALL neighbors formed by changing exactly one gene to any other slot.
- Move to the neighbor with the lowest cost if it improves the current cost (steepest improvement).
- When stuck (local optimum), restart from a new random solution.

Parameters:
- random_restarts = 50
- max_iterations = 5000 (global budget across restarts)

Time complexity:
- Each hill-climbing step evaluates O(num_subjects * num_slots) neighbors.
- Worst case ~ O(max_iterations * num_subjects * num_slots) fitness calls.
"""

from __future__ import annotations

import random
from typing import Any, Dict, List, Tuple

from .base import BaseScheduler
from .fitness import calculate_fitness


class HillClimbingScheduler(BaseScheduler):
    def __init__(
        self,
        subjects: List[str],
        time_slots: List[str],
        constraints: Dict[str, List[str]],
        *,
        priorities: Dict[str, int] | None = None,
        additional_constraints: Dict[str, Any] | None = None,
        subject_details: Dict[str, Any] | None = None,
        random_restarts: int = 50,
        max_iterations: int = 5000,
    ):
        super().__init__(
            subjects,
            time_slots,
            constraints,
            priorities=priorities,
            additional_constraints=additional_constraints,
            subject_details=subject_details,
        )
        self.random_restarts = random_restarts
        self.max_iterations = max_iterations

    def _random_solution(self) -> List[int]:
        return [random.randint(0, self.num_slots - 1) for _ in range(self.num_subjects)]

    def get_neighbors(self, solution: List[int]) -> List[List[int]]:
        neighbors: List[List[int]] = []
        for i in range(self.num_subjects):  # AI_ALGORITHM
            current = solution[i]
            for s in range(self.num_slots):
                if s == current:
                    continue
                n = solution.copy()
                n[i] = s
                neighbors.append(n)
        return neighbors

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
        schedule_result = []
        for i, subject_name in enumerate(self.subjects):
            slot_index = best_individual[i]
            slot_name = self.time_slots[slot_index]
            schedule_result.append({"subject": subject_name, "time": slot_name})
        return schedule_result

    def run(self) -> Tuple[List[dict], float, List[Dict[str, Any]]]:
        best_global = None
        best_global_cost = float("inf")
        convergence_hc: List[Dict[str, Any]] = []  # AI_REPORT

        iterations_used = 0

        for _restart in range(self.random_restarts):  # AI_ALGORITHM
            if iterations_used >= self.max_iterations:
                break

            current = self._random_solution()
            current_cost = self._fitness(current)

            if current_cost < best_global_cost:
                best_global_cost = current_cost
                best_global = current

            improved = True
            while improved and iterations_used < self.max_iterations:  # AI_ALGORITHM
                improved = False
                best_neighbor = None
                best_neighbor_cost = current_cost

                # Steepest-ascent: scan all single-gene moves
                for i in range(self.num_subjects):
                    orig = current[i]
                    for s in range(self.num_slots):
                        if s == orig:
                            continue
                        neighbor = current.copy()
                        neighbor[i] = s
                        c = self._fitness(neighbor)
                        iterations_used += 1
                        
                        # Record convergence every 100 iterations
                        if iterations_used % 100 == 0:  # AI_REPORT
                            convergence_hc.append({"iteration": iterations_used, "cost": float(best_global_cost)})
                        
                        if c < best_neighbor_cost:
                            best_neighbor_cost = c
                            best_neighbor = neighbor
                        if iterations_used >= self.max_iterations:
                            break
                    if iterations_used >= self.max_iterations:
                        break

                if best_neighbor is not None and best_neighbor_cost < current_cost:
                    current = best_neighbor
                    current_cost = best_neighbor_cost
                    improved = True
                    if current_cost < best_global_cost:
                        best_global_cost = current_cost
                        best_global = current

        if best_global is None:
            best_global = self._random_solution()
            best_global_cost = self._fitness(best_global)

        # Add final convergence point
        convergence_hc.append({"iteration": iterations_used, "cost": float(best_global_cost)})  # AI_REPORT

        return self._decode(best_global), float(best_global_cost), convergence_hc

