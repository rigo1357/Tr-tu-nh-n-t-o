# Implementation Plan: AI Algorithm Improvements

## Overview

Implement comprehensive AI optimization upgrades for the Smart Scheduler system. The plan proceeds in layers: shared infrastructure first (PenaltyConfig, BaseScheduler, AC-3), then algorithm-by-algorithm improvements (GA, SA), then new algorithms (Tabu Search, Hybrid GA+SA), and finally dispatcher wiring. Each layer is independently testable before the next begins.

## Tasks

- [ ] 1. Add PenaltyConfig schema and update ScheduleInput
  - [ ] 1.1 Define `PenaltyConfig` Pydantic model in `smart-scheduler-api/schemas.py`
    - Add all 10 fields with `ge=0` validators and documented defaults: `slot_collision_high=1000`, `slot_collision_low=1500`, `forbidden_slot_base=500`, `unavailable_slot_base=800`, `consecutive_day_penalty=200`, `day_imbalance_factor=50`, `afternoon_penalty=100`, `saturday_penalty=300`, `triple_consecutive_penalty=300`, `instructor_conflict_penalty=800`
    - Add `penalty_config: Optional[PenaltyConfig] = None` and `use_ac3: bool = True` fields to `ScheduleInput`
    - _Requirements: 12.1, 12.2, 14.5_

  - [ ]* 1.2 Write unit tests for PenaltyConfig validation
    - Test that negative field values return HTTP 422
    - Test that default `PenaltyConfig()` matches hardcoded defaults
    - _Requirements: 12.6_

- [ ] 2. Update `calculate_fitness()` to accept PenaltyConfig and add new penalty rules
  - [ ] 2.1 Update `calculate_fitness()` signature in `smart-scheduler-api/genetic_algorithm/fitness.py`
    - Add `penalty_config: "PenaltyConfig | None" = None` parameter
    - Replace all magic number penalty constants with values from `penalty_config` (falling back to `PenaltyConfig()` when `None`)
    - _Requirements: 12.3, 12.4_

  - [ ]* 2.2 Write property test for PenaltyConfig backward compatibility (Property 19)
    - **Property 19: PenaltyConfig backward compatibility**
    - **Validates: Requirements 12.4**

  - [ ]* 2.3 Write property test for PenaltyConfig penalty scaling linearity (Property 20)
    - **Property 20: PenaltyConfig penalty scaling linearity**
    - **Validates: Requirements 12.5**

  - [ ] 2.4 Add triple-consecutive penalty rule to `calculate_fitness()`
    - Group assigned slots by day using `"{day}_{period}"` format; sort periods as Sáng < Chiều < Tối
    - When `additional_constraints.get("avoidTripleConsecutive")` is `True`, count groups of 3 consecutive periods per day and add `penalty_config.triple_consecutive_penalty` per group
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ]* 2.5 Write property test for triple consecutive penalty zero case (Property 15)
    - **Property 15: Triple consecutive penalty is zero when no triple exists**
    - **Validates: Requirements 10.4**

  - [ ]* 2.6 Write property test for triple consecutive penalty positive case (Property 16)
    - **Property 16: Triple consecutive penalty is positive when triple exists**
    - **Validates: Requirements 10.5**

  - [ ] 2.7 Add instructor conflict penalty rule to `calculate_fitness()`
    - Build `instructor -> [slot_indices]` map from `subject_details`
    - For each instructor with 2+ subjects in the same slot index, add `penalty_config.instructor_conflict_penalty` per conflicting pair
    - Skip subjects where `instructor` is `None` or empty string
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ]* 2.8 Write property test for instructor conflict penalty zero case (Property 17)
    - **Property 17: Instructor conflict penalty is zero when no conflicts exist**
    - **Validates: Requirements 11.4**

  - [ ]* 2.9 Write property test for instructor conflict penalty positive case (Property 18)
    - **Property 18: Instructor conflict penalty is positive when conflicts exist**
    - **Validates: Requirements 11.5**

- [ ] 3. Checkpoint — Ensure all fitness tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Update `BaseScheduler` to support `reduced_domains`
  - [ ] 4.1 Add `reduced_domains` parameter and `_effective_slots()` helper to `BaseScheduler` in `smart-scheduler-api/genetic_algorithm/base.py`
    - Add `reduced_domains: Dict[str, List[int]] | None = None` to `__init__`
    - Implement `_effective_slots(subject: str) -> List[int]`: returns `reduced_domains[subject]` if available and non-empty, else `list(range(num_slots))`
    - _Requirements: 14.1, 14.4_

  - [ ]* 4.2 Write property test for BaseScheduler respecting reduced domains (Property 21)
    - **Property 21: BaseScheduler respects reduced domains**
    - **Validates: Requirements 14.2**

- [ ] 5. Implement AC-3 preprocessor
  - [ ] 5.1 Create `smart-scheduler-api/genetic_algorithm/ac3.py` with `run_ac3()` function
    - For each subject, start with `domain = list(range(len(time_slots)))`
    - Remove indices of slot names listed in `constraints[subject]`
    - If domain becomes empty, restore full domain and emit `logging.warning`
    - Return `Dict[str, List[int]]` mapping subject name to valid slot indices
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 5.2 Write property test for AC-3 soundness (Property 10)
    - **Property 10: AC-3 soundness — forbidden slots are excluded from reduced domains**
    - **Validates: Requirements 8.2, 8.3**

  - [ ]* 5.3 Write property test for AC-3 monotonicity (Property 11)
    - **Property 11: AC-3 monotonicity — reduced domains are never larger than full domain**
    - **Validates: Requirements 8.7**

- [ ] 6. Checkpoint — Ensure all BaseScheduler and AC-3 tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Upgrade `ScheduleGA` — crossover strategies
  - [ ] 7.1 Add `crossover_strategy` parameter and implement crossover methods in `smart-scheduler-api/genetic_algorithm/scheduler_ga.py`
    - Add `crossover_strategy: str = "order_crossover"` to `__init__`; raise `ValueError` for invalid values listing valid options
    - Implement `_single_point_crossover(p1, p2)`, `_order_crossover(p1, p2)`, `_uniform_crossover(p1, p2)`
    - OX: copy a random contiguous segment from p1; fill remaining positions from p2 in order
    - Uniform: for each gene, pick from p1 or p2 with probability 0.5
    - Update `crossover()` dispatcher to route based on `crossover_strategy`
    - _Requirements: 1.1, 1.2, 1.3, 1.6_

  - [ ]* 7.2 Write property test for crossover preserving chromosome length (Property 1)
    - **Property 1: Crossover preserves chromosome length**
    - **Validates: Requirements 1.2, 1.3, 1.4**

  - [ ]* 7.3 Write property test for uniform crossover gene source (Property 2)
    - **Property 2: Uniform crossover child genes come from parents**
    - **Validates: Requirements 1.3**

  - [ ]* 7.4 Write property test for OX child slot indices in valid range (Property 3)
    - **Property 3: OX child slot indices are in valid range**
    - **Validates: Requirements 1.5**

- [ ] 8. Upgrade `ScheduleGA` — adaptive mutation and constraint repair
  - [ ] 8.1 Implement adaptive mutation in `smart-scheduler-api/genetic_algorithm/scheduler_ga.py`
    - Add parameters: `base_mutation_rate=0.1`, `max_mutation_rate=0.5`, `mutation_step=0.05`, `stagnation_threshold=20`
    - Track `stagnation_counter` and `_current_mutation_rate`; update each generation: increment rate when stagnating, reset to `base_mutation_rate` when best score improves
    - Clamp rate to `[base_mutation_rate, max_mutation_rate]` at all times
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 8.2 Write property test for mutation rate bounds (Property 4)
    - **Property 4: Mutation rate is bounded**
    - **Validates: Requirements 2.4**

  - [ ]* 8.3 Write property test for mutation rate non-decreasing with stagnation (Property 5)
    - **Property 5: Mutation rate is non-decreasing with stagnation**
    - **Validates: Requirements 2.5**

  - [ ] 8.4 Implement `_constraint_repair()` in `smart-scheduler-api/genetic_algorithm/scheduler_ga.py`
    - After mutation, scan for duplicate slot assignments; for each duplicate, find nearest unused slot index scanning outward; if none found, leave gene unchanged
    - Never introduce out-of-range indices; apply repair before adding individual to new population
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 8.5 Write property test for constraint repair idempotence (Property 6)
    - **Property 6: Constraint repair is idempotent on conflict-free individuals**
    - **Validates: Requirements 3.5**

  - [ ]* 8.6 Write property test for constraint repair never increasing conflicts (Property 7)
    - **Property 7: Constraint repair never increases conflicts**
    - **Validates: Requirements 3.6**

  - [ ]* 8.7 Write property test for constraint repair preserving valid slot indices (Property 8)
    - **Property 8: Constraint repair preserves valid slot indices**
    - **Validates: Requirements 3.4**

- [ ] 9. Upgrade `ScheduleGA` — early stopping
  - [ ] 9.1 Add early stopping logic to `ScheduleGA` in `smart-scheduler-api/genetic_algorithm/scheduler_ga.py`
    - Add `early_stopping_patience: int = 30` parameter; when `<= 0`, disable early stopping
    - Stop evolution loop when `stagnation_counter >= early_stopping_patience`
    - Record `{"stopped_early": True}` in convergence log entry for the stopping generation
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 9.2 Write unit tests for early stopping behavior
    - Test that GA stops at correct generation when patience is exceeded
    - Test that `stopped_early: true` appears in convergence log
    - Test that `early_stopping_patience <= 0` disables early stopping
    - _Requirements: 4.2, 4.4, 4.5_

- [ ] 10. Checkpoint — Ensure all GA tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Upgrade `SimulatedAnnealingScheduler` — adaptive cooling and swap neighbor
  - [ ] 11.1 Add adaptive cooling schedule to `smart-scheduler-api/genetic_algorithm/simulated_annealing.py`
    - Add parameters: `cooling_strategy="adaptive"`, `alpha_fast=0.99`, `alpha_slow=0.999`, `target_acceptance_rate=0.4`, `acceptance_window=100`
    - Implement `_update_temperature(accepted: bool)`: maintain `_acceptance_history` deque of size `acceptance_window`; compute acceptance rate; apply `alpha_fast` when rate > target, `alpha_slow` otherwise; clamp to `T_min`
    - Keep `"geometric"` strategy working as before
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 11.2 Write property test for SA temperature monotonically non-increasing (Property 12)
    - **Property 12: SA temperature is monotonically non-increasing**
    - **Validates: Requirements 5.5, 5.6**

  - [ ] 11.3 Add swap neighbor generation to `smart-scheduler-api/genetic_algorithm/simulated_annealing.py`
    - Add `neighbor_strategy: str = "mixed"` parameter with values `"single_gene"`, `"swap"`, `"mixed"`
    - Implement `_swap_neighbor(solution)`: pick two distinct random indices `i ≠ j`, swap `solution[i]` and `solution[j]`
    - Implement `_random_neighbor(solution)`: dispatch to `_single_gene_neighbor` or `_swap_neighbor` with probability 0.5 when strategy is `"mixed"`
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [ ]* 11.4 Write property test for swap neighbor symmetry (Property 13)
    - **Property 13: Swap neighbor symmetry**
    - **Validates: Requirements 6.4**

  - [ ]* 11.5 Write property test for swap neighbor preserving length and valid indices (Property 14)
    - **Property 14: Swap neighbor preserves length and valid indices**
    - **Validates: Requirements 6.3**

- [ ] 12. Implement Tabu Search algorithm
  - [ ] 12.1 Create `smart-scheduler-api/genetic_algorithm/tabu_search.py` with `TabuSearchScheduler`
    - Inherit `BaseScheduler`; add parameters `tenure: int = 10`, `max_iter: int = 1000`
    - Use `collections.deque(maxlen=tenure)` for tabu list storing `(subject_index, new_slot_index)` tuples
    - Implement `run()`: initialize random solution; each step evaluate all single-gene moves using `_effective_slots()`; select best non-tabu move; apply aspiration criterion (allow tabu move if it beats global best); if all moves tabu and no aspiration, select lowest-cost tabu move; add executed move to tabu list; update global best
    - Call `calculate_fitness()` exclusively for cost evaluation
    - Return `(schedule: List[dict], cost: float)`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 12.2 Write property test for tabu list size never exceeding tenure (Property 9)
    - **Property 9: Tabu list size never exceeds tenure**
    - **Validates: Requirements 7.2, 7.6, 7.9**

  - [ ]* 12.3 Write unit tests for Tabu Search behavior
    - Test aspiration criterion allows tabu move when it beats global best
    - Test forced move when all moves are tabu and no aspiration applies
    - _Requirements: 7.3, 7.4_

- [ ] 13. Implement Hybrid GA+SA algorithm
  - [ ] 13.1 Create `smart-scheduler-api/genetic_algorithm/hybrid_ga_sa.py` with `HybridGASAScheduler`
    - Inherit `BaseScheduler`; add parameters `ga_generations=100`, `sa_interval=20`, `top_k=5`, `sa_max_iter=500`
    - Implement `run()`: instantiate and run `ScheduleGA` for `ga_generations`; every `sa_interval` generations, extract `top_k` best individuals; for each, run `SimulatedAnnealingScheduler` local search for `sa_max_iter` steps; replace GA population members with SA-improved individuals if SA found better cost; continue GA from updated population
    - Build convergence log with `{"phase": "ga", "generation": int, "cost": float}` and `{"phase": "sa", "generation": int, "individual": int, "cost": float}` entries
    - Call `calculate_fitness()` exclusively; reuse `ScheduleGA` and `SimulatedAnnealingScheduler` — do not re-implement GA or SA logic
    - Return `(schedule: List[dict], cost: float, convergence: List[dict])`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_

  - [ ]* 13.2 Write property test for Hybrid SA not worsening GA result (Property 22)
    - **Property 22: Hybrid SA local search does not worsen GA result**
    - **Validates: Requirements 9.7**

  - [ ]* 13.3 Write unit tests for Hybrid convergence log
    - Test that convergence log contains both `"ga"` and `"sa"` phase entries
    - Test that SA-improved individuals replace GA population members when cost is lower
    - _Requirements: 9.6_

- [ ] 14. Checkpoint — Ensure all algorithm tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Update dispatcher in `main.py` and wire everything together
  - [ ] 15.1 Update `_run_scheduler_algorithm()` in `smart-scheduler-api/main.py`
    - Add `penalty_config=None` and `use_ac3: bool = True` parameters
    - Run `run_ac3()` from `genetic_algorithm/ac3` when `use_ac3=True`; pass `reduced_domains` to all algorithm constructors
    - Pass `penalty_config` to all algorithm constructors via `common_kwargs`
    - Add routing for `algorithm = "tabu"` → `TabuSearchScheduler` and `algorithm = "hybrid"` → `HybridGASAScheduler`
    - Raise `HTTPException(400, ...)` listing all valid algorithm values when unknown algorithm is provided
    - Extract `penalty_config` and `use_ac3` from `ScheduleInput` and forward to dispatcher
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 14.3_

  - [ ]* 15.2 Write integration tests for dispatcher routing
    - Test each algorithm value (`"ga"`, `"sa"`, `"hill_climbing"`, `"minimax"`, `"tabu"`, `"hybrid"`) routes correctly
    - Test invalid algorithm returns HTTP 400
    - Test `penalty_config` is forwarded to algorithms
    - Test `use_ac3=True` triggers AC-3 preprocessing and passes `reduced_domains`
    - _Requirements: 13.1, 13.4, 13.5, 13.6, 14.3_

- [ ] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at each architectural layer
- Property tests use **Hypothesis** (`pip install hypothesis`) with `@settings(max_examples=100)`
- Unit tests use **pytest** — run with `pytest smart-scheduler-api/tests/`
- All algorithms must call `calculate_fitness()` exclusively — never re-implement penalty logic
- `BaseScheduler._effective_slots()` must be used by all subclasses for domain selection
- Test files map to design layout: `tests/test_fitness.py`, `test_ga_crossover.py`, `test_ga_mutation.py`, `test_ga_repair.py`, `test_sa.py`, `test_tabu.py`, `test_ac3.py`, `test_base_scheduler.py`, `test_hybrid.py`, `test_integration.py`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1", "4.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "4.2", "5.1"] },
    { "id": 3, "tasks": ["2.5", "2.6", "2.7", "5.2", "5.3"] },
    { "id": 4, "tasks": ["2.8", "2.9", "7.1", "9.1"] },
    { "id": 5, "tasks": ["7.2", "7.3", "7.4", "8.1", "9.2"] },
    { "id": 6, "tasks": ["8.2", "8.3", "8.4", "11.1"] },
    { "id": 7, "tasks": ["8.5", "8.6", "8.7", "11.2", "11.3"] },
    { "id": 8, "tasks": ["11.4", "11.5", "12.1"] },
    { "id": 9, "tasks": ["12.2", "12.3", "13.1"] },
    { "id": 10, "tasks": ["13.2", "13.3", "15.1"] },
    { "id": 11, "tasks": ["15.2"] }
  ]
}
```
