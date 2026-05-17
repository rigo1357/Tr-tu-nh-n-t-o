================================================================================
TÀI LIỆU HỌC THUẬT: PHÂN TÍCH CHI TIẾT CÁC THUẬT TOÁN TỐI ƯU HÓA XẾP LỊCH HỌC
================================================================================

Tác giả: Nhóm nghiên cứu Smart Scheduler
Ngày: 15/05/2026
Phiên bản: 1.0.0

================================================================================
MỤC LỤC
================================================================================

1. Tổng quan về bài toán
2. Hàm mục tiêu và ràng buộc
3. Thuật toán Di truyền (Genetic Algorithm)
4. Thuật toán Leo đồi (Hill Climbing)
5. Thuật toán Luyện kim mô phỏng (Simulated Annealing)
6. Thuật toán Minimax với Alpha-Beta Pruning
7. So sánh và đánh giá

================================================================================
1. TỔNG QUAN VỀ BÀI TOÁN
================================================================================

1.1. Định nghĩa bài toán
-------------------------
Bài toán xếp lịch học (Course Scheduling Problem) là một bài toán tối ưu hóa 
tổ hợp thuộc lớp NP-hard. Mục tiêu là gán N môn học vào M khung giờ sao cho 
tối thiểu hóa các vi phạm ràng buộc.

Không gian tìm kiếm: O(M^N)

Với N=10 môn học và M=21 khung giờ, không gian tìm kiếm có kích thước:
21^10  1.67  10^13 trạng thái

1.2. Biểu diễn nghiệm
---------------------
Mỗi nghiệm được biểu diễn dưới dạng một vector số nguyên:

    individual = [s, s, s, ..., s_{N-1}]

Trong đó:
- individual[i] là chỉ số khung giờ được gán cho môn học thứ i
- 0  individual[i] < M

Ví dụ:
    subjects = ["Toán", "Lý", "Hóa"]
    time_slots = ["T2_Sáng", "T2_Chiều", "T3_Sáng"]
    individual = [0, 2, 1]
    
    Giải thích: ToánT2_Sáng, LýT3_Sáng, HóaT2_Chiều


================================================================================
2. HÀM MỤC TIÊU VÀ RÀNG BUỘC
================================================================================

2.1. Hàm fitness (calculate_fitness)
------------------------------------
Hàm fitness là SINGLE SOURCE OF TRUTH cho tất cả 4 thuật toán.
Mục tiêu: TỐI THIỂU HÓA PENALTY

Chữ ký hàm:
    def calculate_fitness(
        *,
        subjects: List[str],
        time_slots: List[str],
        constraints: Dict[str, List[str]],
        individual: List[int],
        priorities: Dict[str, int] | None = None,
        additional_constraints: Dict[str, Any] | None = None,
        subject_details: Dict[str, Any] | None = None,
    ) -> float

2.2. Các ràng buộc và penalty
------------------------------

RÀNG BUỘC 1: Xung đột khung giờ (Hard Constraint)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Hai môn học được gán vào cùng một khung giờ

Code:
    if slot_index in slots_used:
        if current_priority > existing_priority:
            penalty += 1000  # Môn ưu tiên cao hơn
        else:
            penalty += 1500  # Môn ưu tiên thấp hơn

Giải thích:
- Đây là ràng buộc cứng quan trọng nhất
- Penalty cao (1000-1500) đảm bảo thuật toán ưu tiên giải quyết xung đột này
- Môn có priority cao bị phạt ít hơn vì khó tránh hơn

RÀNG BUỘC 2: Khung giờ bị cấm (Hard Constraint)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Môn học được xếp vào khung giờ trong danh sách cấm

Code:
    if assigned_slot_name in forbidden_slots:
        priority = priorities.get(subject_name, 5)
        penalty += 500 - (priority - 5) * 50

Giải thích:
- Penalty động dựa trên độ ưu tiên
- Priority 10: penalty = 500 - (10-5)*50 = 250
- Priority 5:  penalty = 500 - (5-5)*50 = 500
- Priority 1:  penalty = 500 - (1-5)*50 = 700

RÀNG BUỘC 3: Tránh môn liên tiếp cùng ngày (Soft Constraint)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Hai môn liên tiếp trong danh sách được xếp cùng ngày

Code:
    if additional_constraints.get("avoidConsecutive", False):
        for i in range(len(individual) - 1):
            day1 = time_slots[individual[i]].split("_")[0]
            day2 = time_slots[individual[i + 1]].split("_")[0]
            if day1 == day2:
                penalty += 200

Giải thích:
- Ràng buộc mềm giúp phân bổ môn học đều qua các ngày
- Penalty = 200 cho mỗi cặp môn liên tiếp cùng ngày

RÀNG BUỘC 4: Cân bằng số môn giữa các ngày (Soft Constraint)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Chênh lệch số môn học giữa các ngày trong tuần

Code:
    if additional_constraints.get("balanceDays", False):
        day_counts: Dict[str, int] = {}
        for slot_index in individual:
            day = time_slots[slot_index].split("_")[0]
            day_counts[day] = day_counts.get(day, 0) + 1
        penalty += (max(day_counts.values()) - min(day_counts.values())) * 50

Giải thích:
- Penalty tỷ lệ với độ chênh lệch
- Ví dụ: Ngày có 5 môn, ngày có 1 môn  penalty = (5-1)*50 = 200

RÀNG BUỘC 5: Ưu tiên buổi sáng (Soft Constraint)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Penalty cho môn học buổi chiều

Code:
    if additional_constraints.get("preferMorning", False):
        for slot_index in individual:
            slot_name = time_slots[slot_index]
            if "Chiều" in slot_name:
                penalty += 100

RÀNG BUỘC 6: Không học thứ 7 (Soft Constraint)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Penalty cho môn học thứ 7

Code:
    if not additional_constraints.get("allowSaturday", False):
        for slot_index in individual:
            slot_name = time_slots[slot_index]
            if "T7" in slot_name:
                penalty += 300

RÀNG BUỘC 7: Khung giờ không khả dụng (Soft Constraint)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Môn học được xếp vào khung giờ không có trong danh sách available

Code:
    unavailable_slots = set(additional_constraints.get("unavailable_slots", []))
    for i, slot_index in enumerate(individual):
        subject_name = subjects[i]
        slot_name = time_slots[slot_index]
        if slot_name in unavailable_slots:
            priority = priorities.get(subject_name, 5)
            penalty += 800 - (priority - 5) * 50

BONUS (Penalty âm):
~~~~~~~~~~~~~~~~~~~
1. Ngày ưa thích: -150 khi môn được xếp vào ngày yêu thích
2. Môn học lại buổi sáng: -20 khuyến khích môn học lại học buổi sáng
3. Môn thường buổi tối: +80 phạt môn thường học buổi tối

# smart-scheduler-api/genetic_algorithm/scheduler_ga.py
import random
from typing import Any, Dict, List

from .fitness import calculate_fitness  # AI_ALGORITHM

# ... (ToÃ n bá»™ code ScheduleGA vÃ  find_optimal_schedule cá»§a báº¡n á»Ÿ Ä‘Ã¢y) ...
# (Code báº¡n gá»­i Ä‘Ã£ ráº¥t tá»‘t, giá»¯ nguyÃªn)
class ScheduleGA:
    def __init__(self, subjects, time_slots, constraints, priorities=None, additional_constraints=None, subject_details=None):
        self.subjects = subjects
        self.time_slots = time_slots
        self.constraints = constraints # VÃ­ dá»¥: {'ToÃ¡n': ['Thá»© 2 - SÃ¡ng']}
        self.priorities = priorities or {}  # Dictionary: subject_name -> priority (1-10)
        self.additional_constraints = additional_constraints or {}  # RÃ ng buá»™c bá»• sung
        self.subject_details = subject_details or {}
        
        self.num_subjects = len(subjects)
        self.num_slots = len(time_slots)

        # Táº¡o map Ä‘á»ƒ tra cá»©u index nhanh (ráº¥t quan trá»ng)
        self.slot_to_index = {slot: i for i, slot in enumerate(self.time_slots)}

    # === 1. BIá»‚U DIá»„N (Chromosome) ===
    def create_individual(self):
        return [random.randint(0, self.num_slots - 1) for _ in range(self.num_subjects)]

    # === 2. HÃ€M THÃCH NGHI (Fitness Function) ===
    def calculate_fitness(self, individual):
        return calculate_fitness(  # AI_ALGORITHM
            subjects=self.subjects,
            time_slots=self.time_slots,
            constraints=self.constraints,
            individual=individual,
            priorities=self.priorities,
            additional_constraints=self.additional_constraints,
            subject_details=self.subject_details,
        )

    # === 3. CHá»ŒN Lá»ŒC (Selection) ===
    def selection(self, population_with_scores):
        tournament_size = 5
        tournament = random.sample(population_with_scores, tournament_size)
        tournament.sort(key=lambda x: x[1]) # x[1] lÃ  Ä‘iá»ƒm penalty
        return tournament[0][0], tournament[1][0] # x[0] lÃ  cÃ¡ thá»ƒ (list)

    # === 4. LAI GHÃ‰P (Crossover) ===
    def crossover(self, parent1, parent2):
        point = random.randint(1, self.num_subjects - 1)
        child1 = parent1[:point] + parent2[point:]
        child2 = parent2[:point] + parent1[point:]
        return child1, child2

    # === 5. Äá»˜T BIáº¾N (Mutation) ===
    def mutate(self, individual):
        if random.random() < 0.1: # Tá»· lá»‡ Ä‘á»™t biáº¿n 10%
            subject_index = random.randint(0, self.num_subjects - 1)
            new_slot_index = random.randint(0, self.num_slots - 1)
            individual[subject_index] = new_slot_index
        return individual

    # ----------------------------------------------------
    # HÃ€M CHáº Y CHÃNH
    # ----------------------------------------------------
    def run_ga(self):
        POPULATION_SIZE = 100
        GENERATIONS = 200 # Sá»‘ tháº¿ há»‡

        population = [self.create_individual() for _ in range(POPULATION_SIZE)]
        best_individual = None
        best_score = float('inf')
        convergence_ga: List[Dict[str, Any]] = []  # AI_REPORT

        for gen in range(GENERATIONS):
            population_with_scores = []
            for individual in population:
                score = self.calculate_fitness(individual)
                population_with_scores.append((individual, score))
                
                if score < best_score:
                    best_score = score
                    best_individual = individual

            if best_score == 0:
                print("TÃ¬m tháº¥y giáº£i phÃ¡p hoÃ n háº£o!")
                convergence_ga.append({"generation": gen, "cost": float(best_score)})  # AI_REPORT
                break
                
            new_population = []
            population_with_scores.sort(key=lambda x: x[1])
            elitism_count = int(POPULATION_SIZE * 0.1)
            new_population.extend([ind[0] for ind in population_with_scores[:elitism_count]])

            while len(new_population) < POPULATION_SIZE:
                parent1, parent2 = self.selection(population_with_scores)
                child1, child2 = self.crossover(parent1, parent2)
                child1 = self.mutate(child1)
                child2 = self.mutate(child2)
                new_population.append(child1)
                if len(new_population) < POPULATION_SIZE:
                    new_population.append(child2)

            population = new_population
            convergence_ga.append({"generation": gen, "cost": float(best_score)})  # AI_REPORT
            
            if gen % 20 == 0:
                print(f"Tháº¿ há»‡ {gen}: Äiá»ƒm tá»‘t nháº¥t (penalty) = {best_score}")

        print(f"HoÃ n táº¥t GA! Äiá»ƒm cuá»‘i cÃ¹ng = {best_score}")
        if best_individual is None:
            best_individual = population[0] if population else self.create_individual()
        
        return self.decode_result(best_individual), best_score, convergence_ga

    def decode_result(self, best_individual):
        schedule_result = []
        for i, subject_name in enumerate(self.subjects):
            slot_index = best_individual[i]
            slot_name = self.time_slots[slot_index]
            schedule_result.append({
                "subject": subject_name,
                "time": slot_name
            })
        return schedule_result

# ----------------------------------------------------
# HÃ€M "CÃ”NG KHAI" Äá»‚ main.py Gá»ŒI
# ----------------------------------------------------
def find_optimal_schedule(subjects, time_slots, constraints, priorities=None, additional_constraints=None, subject_details=None):
    ga = ScheduleGA(subjects, time_slots, constraints, priorities, additional_constraints, subject_details)
    final_schedule, final_cost, convergence_ga = ga.run_ga()
    return final_schedule, final_cost, convergence_ga
