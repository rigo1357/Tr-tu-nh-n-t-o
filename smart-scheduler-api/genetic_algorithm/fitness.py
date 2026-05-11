"""
Shared fitness / cost function for all scheduling algorithms.

IMPORTANT:
- This module is the single source of truth for penalty logic.
- All optimizers (GA, Hill Climbing, Simulated Annealing, Minimax) must call
  `calculate_fitness` and MUST NOT re-implement penalty rules elsewhere.

Problem encoding:
- `subjects[i]` is assigned to `time_slots[individual[i]]`
- `individual` is a list[int] with length == len(subjects)
"""

from __future__ import annotations

from typing import Any, Dict, List


def calculate_fitness(  # AI_ALGORITHM
    *,
    subjects: List[str],
    time_slots: List[str],
    constraints: Dict[str, List[str]],
    individual: List[int],
    priorities: Dict[str, int] | None = None,
    additional_constraints: Dict[str, Any] | None = None,
    subject_details: Dict[str, Any] | None = None,
) -> float:
    priorities = priorities or {}
    additional_constraints = additional_constraints or {}
    subject_details = subject_details or {}

    penalty = 0.0

    # Constraint 1: Slot collisions (two subjects assigned to same slot index)
    slots_used: Dict[int, List[str]] = {}  # slot_index -> [first_subject]
    for i, slot_index in enumerate(individual):  # AI_ALGORITHM
        subject_name = subjects[i]
        if slot_index in slots_used:
            existing_subject = slots_used[slot_index][0]
            current_priority = priorities.get(subject_name, 5)
            existing_priority = priorities.get(existing_subject, 5)

            # Keep higher-priority subject (modeled as lower penalty)
            if current_priority > existing_priority:
                penalty += 1000
            else:
                penalty += 1500
        else:
            slots_used[slot_index] = [subject_name]

    # Constraint 2: Forbidden slots per subject
    for i, subject_name in enumerate(subjects):  # AI_ALGORITHM
        if subject_name not in constraints:
            continue
        forbidden_slots = constraints[subject_name]
        assigned_slot_name = time_slots[individual[i]]
        if assigned_slot_name in forbidden_slots:
            priority = priorities.get(subject_name, 5)
            penalty += 500 - (priority - 5) * 50

    # Constraint 3: Avoid consecutive subjects in the list landing on same day
    if additional_constraints.get("avoidConsecutive", False):  # AI_ALGORITHM
        for i in range(len(individual) - 1):
            slot1 = time_slots[individual[i]]
            slot2 = time_slots[individual[i + 1]]
            day1 = slot1.split("_")[0]
            day2 = slot2.split("_")[0]
            if day1 == day2:
                penalty += 200

    # Constraint 4: Balance subjects across days
    if additional_constraints.get("balanceDays", False):  # AI_ALGORITHM
        day_counts: Dict[str, int] = {}
        for slot_index in individual:
            slot_name = time_slots[slot_index]
            day = slot_name.split("_")[0]
            day_counts[day] = day_counts.get(day, 0) + 1
        if day_counts:
            penalty += (max(day_counts.values()) - min(day_counts.values())) * 50

    # Constraint 5: Prefer morning (penalize afternoon)
    if additional_constraints.get("preferMorning", False):  # AI_ALGORITHM
        for slot_index in individual:
            slot_name = time_slots[slot_index]
            if "Chiều" in slot_name:
                penalty += 100

    # Constraint 6: Disallow Saturday if configured
    if not additional_constraints.get("allowSaturday", False):  # AI_ALGORITHM
        for slot_index in individual:
            slot_name = time_slots[slot_index]
            if "T7" in slot_name:
                penalty += 300

    # Constraint 7: Penalize unavailable slots and apply small bonuses
    unavailable_slots = set(additional_constraints.get("unavailable_slots", []))

    for i, slot_index in enumerate(individual):  # AI_ALGORITHM
        subject_name = subjects[i]
        slot_name = time_slots[slot_index]

        if slot_name in unavailable_slots:
            priority = priorities.get(subject_name, 5)
            penalty += 800 - (priority - 5) * 50

        preferred_days = subject_details.get(subject_name, {}).get("preferred_days", []) or []
        if preferred_days:
            day = slot_name.split("_")[0]
            if day in preferred_days:
                penalty -= 150

        is_retake = bool(subject_details.get(subject_name, {}).get("is_retake", False))
        if (not is_retake) and ("Tối" in slot_name):
            penalty += 80
        if is_retake and ("Sáng" in slot_name):
            penalty -= 20

    return float(penalty)

