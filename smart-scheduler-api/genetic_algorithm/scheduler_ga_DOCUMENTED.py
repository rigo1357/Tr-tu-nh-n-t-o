# smart-scheduler-api/genetic_algorithm/scheduler_ga.py
"""
Thuật toán Di truyền (Genetic Algorithm) cho bài toán xếp lịch học.

Module này implement GA để tối ưu hóa việc gán N môn học vào M khung giờ,
tối thiểu hóa các vi phạm ràng buộc (penalty).

Tác giả: Smart Scheduler Team
Ngày: 15/05/2026
"""

import random
from typing import Any, Dict, List, Tuple

from .fitness import calculate_fitness


class ScheduleGA:
    """
    Lớp triển khai Thuật toán Di truyền cho bài toán xếp lịch học.
    
    Thuật toán mô phỏng quá trình tiến hóa tự nhiên với các toán tử:
    - Selection (Chọn lọc): Tournament selection
    - Crossover (Lai ghép): Single-point crossover
    - Mutation (Đột biến): Random gene modification
    - Elitism: Giữ lại cá thể tốt nhất
    """
    
    def __init__(
        self,
        subjects: List[str],
        time_slots: List[str],
        constraints: Dict[str, List[str]],
        priorities: Dict[str, int] = None,
        additional_constraints: Dict[str, Any] = None,
        subject_details: Dict[str, Any] = None
    ):
        """
        Khởi tạo thuật toán GA với các tham số bài toán.
        
        Args:
            subjects: Danh sách tên môn học
            time_slots: Danh sách tên khung giờ (VD: "T2_Sáng")
            constraints: Dict ánh xạ môn học -> danh sách slot bị cấm
            priorities: Dict ánh xạ môn học -> độ ưu tiên (1-10)
            additional_constraints: Các ràng buộc bổ sung (avoidConsecutive, etc.)
            subject_details: Thông tin chi tiết môn học (instructor, dates, etc.)
        """
        self.subjects = subjects
        self.time_slots = time_slots
        self.constraints = constraints
        self.priorities = priorities or {}
        self.additional_constraints = additional_constraints or {}
        self.subject_details = subject_details or {}
        
        self.num_subjects = len(subjects)
        self.num_slots = len(time_slots)
        
        # Tạo map để tra cứu index nhanh (tối ưu performance)
        self.slot_to_index = {slot: i for i, slot in enumerate(self.time_slots)}

    def create_individual(self) -> List[int]:
        """
        Tạo một cá thể (individual/chromosome) ngẫu nhiên.
        
        Mỗi cá thể là một vector số nguyên độ dài N (số môn học),
        trong đó individual[i] là chỉ số khung giờ được gán cho môn học thứ i.
        
        Returns:
            List[int]: Cá thể ngẫu nhiên, VD: [3, 7, 12, 0, 18] với 5 môn học
            
        Giải thích:
            - Khởi tạo ngẫu nhiên giúp khám phá không gian tìm kiếm rộng
            - Mỗi gen (individual[i]) có giá trị từ 0 đến num_slots-1
        """
        return [random.randint(0, self.num_slots - 1) for _ in range(self.num_subjects)]

    def calculate_fitness(self, individual: List[int]) -> float:
        """
        Tính fitness (độ thích nghi) cho một cá thể.
        
        Fitness = tổng penalty của tất cả các vi phạm ràng buộc.
        Mục tiêu: TỐI THIỂU HÓA fitness (fitness = 0 là hoàn hảo).
        
        Args:
            individual: Cá thể cần đánh giá
            
        Returns:
            float: Giá trị penalty (càng thấp càng tốt)
            
        Giải thích:
            - Gọi hàm calculate_fitness từ module fitness.py
            - Hàm này là "single source of truth" cho logic penalty
            - Tất cả thuật toán (GA, HC, SA, Minimax) dùng chung hàm này
        """
        return calculate_fitness(
            subjects=self.subjects,
            time_slots=self.time_slots,
            constraints=self.constraints,
            individual=individual,
            priorities=self.priorities,
            additional_constraints=self.additional_constraints,
            subject_details=self.subject_details,
        )

    def selection(
        self, 
        population_with_scores: List[Tuple[List[int], float]]
    ) -> Tuple[List[int], List[int]]:
        """
        Chọn lọc 2 cá thể cha mẹ bằng Tournament Selection.
        
        Tournament Selection:
        1. Chọn ngẫu nhiên k=5 cá thể từ quần thể
        2. Sắp xếp theo fitness (penalty)
        3. Trả về 2 cá thể tốt nhất trong tournament
        
        Args:
            population_with_scores: List các tuple (individual, fitness_score)
            
        Returns:
            Tuple[List[int], List[int]]: 2 cá thể cha mẹ được chọn
            
        Giải thích:
            - Tournament size = 5 cân bằng giữa áp lực chọn lọc và đa dạng
            - Áp lực chọn lọc cao hơn Roulette Wheel, thấp hơn Rank Selection
            - Không cần normalize fitness như Roulette Wheel
            - Dễ implement và hiệu quả với bài toán minimization
        """
        tournament_size = 5
        
        # Chọn ngẫu nhiên 5 cá thể từ quần thể
        tournament = random.sample(population_with_scores, tournament_size)
        
        # Sắp xếp theo penalty (fitness) tăng dần
        # x[1] là fitness score, x[0] là individual
        tournament.sort(key=lambda x: x[1])
        
        # Trả về 2 cá thể tốt nhất (penalty thấp nhất)
        return tournament[0][0], tournament[1][0]

    def crossover(
        self, 
        parent1: List[int], 
        parent2: List[int]
    ) -> Tuple[List[int], List[int]]:
        """
        Lai ghép 2 cá thể cha mẹ bằng Single-Point Crossover.
        
        Single-Point Crossover:
        1. Chọn ngẫu nhiên một điểm cắt (cut point) từ 1 đến N-1
        2. Con thứ nhất = đầu của cha 1 + đuôi của cha 2
        3. Con thứ hai = đầu của cha 2 + đuôi của cha 1
        
        Args:
            parent1: Cá thể cha thứ nhất
            parent2: Cá thể cha thứ hai
            
        Returns:
            Tuple[List[int], List[int]]: 2 cá thể con
            
        Ví dụ:
            parent1 = [3, 7, 12, 0, 18]
            parent2 = [5, 2, 8, 15, 1]
            point = 2
            child1 = [3, 7] + [8, 15, 1] = [3, 7, 8, 15, 1]
            child2 = [5, 2] + [12, 0, 18] = [5, 2, 12, 0, 18]
            
        Giải thích:
            - Single-point đơn giản nhưng hiệu quả với bài toán xếp lịch
            - Giữ được các "building blocks" (schema) tốt từ cha mẹ
            - Mỗi con kế thừa ~50% gen từ mỗi cha mẹ (trung bình)
        """
        # Chọn điểm cắt ngẫu nhiên (không cắt ở đầu hoặc cuối)
        point = random.randint(1, self.num_subjects - 1)
        
        # Tạo 2 con bằng cách hoán đổi đuôi
        child1 = parent1[:point] + parent2[point:]
        child2 = parent2[:point] + parent1[point:]
        
        return child1, child2

    def mutate(self, individual: List[int]) -> List[int]:
        """
        Đột biến một cá thể với xác suất 10%.
        
        Mutation:
        - Với xác suất 10%: thay đổi ngẫu nhiên MỘT gen (một môn học)
        - Gen được thay đổi thành một slot ngẫu nhiên khác
        
        Args:
            individual: Cá thể cần đột biến
            
        Returns:
            List[int]: Cá thể sau khi đột biến (có thể không thay đổi)
            
        Giải thích:
            - Mutation rate = 10% cân bằng giữa exploitation và exploration
            - Quá cao (>30%): phá vỡ các schema tốt, hội tụ chậm
            - Quá thấp (<5%): mất đa dạng, dễ bị kẹt local optimum
            - Chỉ thay đổi 1 gen để tránh phá vỡ quá nhiều thông tin tốt
        """
        # Kiểm tra xác suất đột biến
        if random.random() < 0.1:  # 10% mutation rate
            # Chọn ngẫu nhiên một môn học để đột biến
            subject_index = random.randint(0, self.num_subjects - 1)
            
            # Gán slot mới ngẫu nhiên cho môn học đó
            new_slot_index = random.randint(0, self.num_slots - 1)
            individual[subject_index] = new_slot_index
        
        return individual

    def run_ga(self) -> Tuple[List[Dict], float, List[Dict[str, Any]]]:
        """
        Chạy thuật toán GA chính.
        
        Quy trình:
        1. Khởi tạo quần thể ngẫu nhiên (100 cá thể)
        2. Lặp qua các thế hệ (max 200):
           a. Đánh giá fitness cho toàn bộ quần thể
           b. Cập nhật cá thể tốt nhất toàn cục
           c. Dừng sớm nếu tìm được nghiệm hoàn hảo (penalty = 0)
           d. Elitism: giữ lại 10% cá thể tốt nhất
           e. Tạo thế hệ mới: selection → crossover → mutation
           f. Ghi lại convergence log
        3. Trả về nghiệm tốt nhất
        
        Returns:
            Tuple gồm:
            - schedule_result: List[Dict] lịch học đã decode
            - best_score: float penalty tốt nhất
            - convergence_ga: List[Dict] log quá trình hội tụ
            
        Giải thích:
            - Population size = 100: đủ lớn để đa dạng, không quá lớn để chậm
            - Generations = 200: đủ để hội tụ với hầu hết bài toán
            - Early stopping: tiết kiệm thời gian khi tìm được nghiệm hoàn hảo
        """
        # ============================================================
        # BƯỚC 1: KHỞI TẠO THAM SỐ
        # ============================================================
        POPULATION_SIZE = 100  # Kích thước quần thể
        GENERATIONS = 200      # Số thế hệ tối đa
        
        # ============================================================
        # BƯỚC 2: KHỞI TẠO QUẦN THỂ NGẪU NHIÊN
        # ============================================================
        # Tạo 100 cá thể ngẫu nhiên để bắt đầu
        population = [self.create_individual() for _ in range(POPULATION_SIZE)]
        
        # Biến lưu trữ cá thể tốt nhất toàn cục
        best_individual = None
        best_score = float('inf')  # Khởi tạo = vô cùng (minimization problem)
        
        # List lưu quá trình hội tụ để vẽ biểu đồ
        convergence_ga: List[Dict[str, Any]] = []
        
        # ============================================================
        # BƯỚC 3: VÒNG LẶP CHÍNH - TIẾN HÓA QUA CÁC THẾ HỆ
        # ============================================================
        for gen in range(GENERATIONS):
            # --------------------------------------------------------
            # 3.1. ĐÁNH GIÁ FITNESS CHO TOÀN BỘ QUẦN THỂ
            # --------------------------------------------------------
            population_with_scores = []
            for individual in population:
                score = self.calculate_fitness(individual)
                population_with_scores.append((individual, score))
                
                # Cập nhật cá thể tốt nhất toàn cục
                if score < best_score:
                    best_score = score
                    best_individual = individual
            
            # --------------------------------------------------------
            # 3.2. ĐIỀU KIỆN DỪNG SỚM (EARLY STOPPING)
            # --------------------------------------------------------
            # Nếu tìm được nghiệm hoàn hảo (penalty = 0), dừng ngay
            if best_score == 0:
                print(f"✓ Tìm thấy giải pháp hoàn hảo tại thế hệ {gen}!")
                convergence_ga.append({"generation": gen, "cost": float(best_score)})
                break
            
            # --------------------------------------------------------
            # 3.3. TẠO THẾ HỆ MỚI
            # --------------------------------------------------------
            new_population = []
            
            # Sắp xếp quần thể theo fitness (tốt nhất lên đầu)
            population_with_scores.sort(key=lambda x: x[1])
            
            # ELITISM: Giữ lại 10% cá thể tốt nhất
            # Đảm bảo nghiệm tốt không bị mất qua các thế hệ
            elitism_count = int(POPULATION_SIZE * 0.1)
            new_population.extend([ind[0] for ind in population_with_scores[:elitism_count]])
            
            # Tạo các cá thể còn lại bằng selection → crossover → mutation
            while len(new_population) < POPULATION_SIZE:
                # Selection: chọn 2 cha mẹ bằng tournament
                parent1, parent2 = self.selection(population_with_scores)
                
                # Crossover: lai ghép tạo 2 con
                child1, child2 = self.crossover(parent1, parent2)
                
                # Mutation: đột biến 2 con
                child1 = self.mutate(child1)
                child2 = self.mutate(child2)
                
                # Thêm con vào quần thể mới
                new_population.append(child1)
                if len(new_population) < POPULATION_SIZE:
                    new_population.append(child2)
            
            # Cập nhật quần thể
            population = new_population
            
            # --------------------------------------------------------
            # 3.4. GHI LẠI CONVERGENCE LOG
            # --------------------------------------------------------
            # Lưu cost tốt nhất của thế hệ này để vẽ biểu đồ
            convergence_ga.append({"generation": gen, "cost": float(best_score)})
            
            # In tiến trình mỗi 20 thế hệ
            if gen % 20 == 0:
                print(f"Thế hệ {gen}: Penalty tốt nhất = {best_score}")
        
        # ============================================================
        # BƯỚC 4: KẾT THÚC - TRẢ VỀ KẾT QUẢ
        # ============================================================
        print(f"✓ Hoàn tất GA! Penalty cuối cùng = {best_score}")
        
        # Xử lý trường hợp không tìm được nghiệm (rất hiếm)
        if best_individual is None:
            best_individual = population[0] if population else self.create_individual()
        
        # Decode individual thành lịch học có thể đọc được
        schedule_result = self.decode_result(best_individual)
        
        return schedule_result, best_score, convergence_ga

    def decode_result(self, best_individual: List[int]) -> List[Dict]:
        """
        Chuyển đổi cá thể (vector số nguyên) thành lịch học có thể đọc được.
        
        Args:
            best_individual: Cá thể tốt nhất (vector slot indices)
            
        Returns:
            List[Dict]: Danh sách các dict {"subject": tên môn, "time": tên slot}
            
        Ví dụ:
            Input: [3, 7, 12]
            Output: [
                {"subject": "Toán", "time": "T2_Tối"},
                {"subject": "Lý", "time": "T3_Chiều"},
                {"subject": "Hóa", "time": "T4_Sáng"}
            ]
        """
        schedule_result = []
        for i, subject_name in enumerate(self.subjects):
            slot_index = best_individual[i]
            slot_name = self.time_slots[slot_index]
            schedule_result.append({
                "subject": subject_name,
                "time": slot_name
            })
        return schedule_result


# ============================================================
# HÀM CÔNG KHAI ĐỂ MAIN.PY GỌI
# ============================================================
def find_optimal_schedule(
    subjects: List[str],
    time_slots: List[str],
    constraints: Dict[str, List[str]],
    priorities: Dict[str, int] = None,
    additional_constraints: Dict[str, Any] = None,
    subject_details: Dict[str, Any] = None
) -> Tuple[List[Dict], float, List[Dict[str, Any]]]:
    """
    Hàm wrapper để chạy GA và tìm lịch học tối ưu.
    
    Đây là hàm được gọi từ main.py khi user chọn thuật toán GA.
    
    Args:
        subjects: Danh sách tên môn học
        time_slots: Danh sách tên khung giờ
        constraints: Dict môn học -> danh sách slot bị cấm
        priorities: Dict môn học -> độ ưu tiên (1-10)
        additional_constraints: Ràng buộc bổ sung
        subject_details: Thông tin chi tiết môn học
        
    Returns:
        Tuple gồm:
        - final_schedule: List[Dict] lịch học tối ưu
        - final_cost: float penalty cuối cùng
        - convergence_ga: List[Dict] log quá trình hội tụ
        
    Ví dụ sử dụng:
        schedule, cost, log = find_optimal_schedule(
            subjects=["Toán", "Lý", "Hóa"],
            time_slots=["T2_Sáng", "T2_Chiều", "T3_Sáng"],
            constraints={"Toán": ["T2_Chiều"]},
            priorities={"Toán": 10, "Lý": 7, "Hóa": 5}
        )
    """
    # Khởi tạo đối tượng GA
    ga = ScheduleGA(
        subjects=subjects,
        time_slots=time_slots,
        constraints=constraints,
        priorities=priorities,
        additional_constraints=additional_constraints,
        subject_details=subject_details
    )
    
    # Chạy thuật toán
    final_schedule, final_cost, convergence_ga = ga.run_ga()
    
    return final_schedule, final_cost, convergence_ga


# ============================================================
# GIẢI THÍCH THUẬT TOÁN
# ============================================================
"""
### 1. TẠI SAO DÙNG TOURNAMENT SELECTION THAY VÌ ROULETTE WHEEL?

**Tournament Selection:**
- Chọn ngẫu nhiên k cá thể, lấy cá thể tốt nhất
- Không cần normalize fitness
- Hoạt động tốt với cả maximization và minimization
- Áp lực chọn lọc dễ điều chỉnh (thay đổi k)

**Roulette Wheel Selection:**
- Xác suất chọn tỷ lệ với fitness
- Cần normalize fitness (phức tạp với minimization)
- Có thể bị dominated bởi cá thể quá tốt (premature convergence)
- Khó điều chỉnh áp lực chọn lọc

**Kết luận:** Tournament đơn giản hơn, hiệu quả hơn với bài toán minimization.

---

### 2. TẠI SAO ELITISM = 10%? TRADE-OFF LÀ GÌ?

**Elitism = 10% (giữ lại 10 cá thể tốt nhất trong quần thể 100):**

**Ưu điểm:**
- Đảm bảo nghiệm tốt nhất không bị mất qua các thế hệ
- Tăng tốc độ hội tụ (luôn có baseline tốt)
- Giảm variance của kết quả

**Nhược điểm:**
- Giảm đa dạng gen (genetic diversity)
- Có thể dẫn đến premature convergence (hội tụ sớm)
- Tăng nguy cơ bị kẹt local optimum

**Trade-off:**
- Elitism quá cao (>20%): Mất đa dạng, dễ kẹt local optimum
- Elitism quá thấp (<5%): Hội tụ chậm, có thể mất nghiệm tốt
- 10% là điểm cân bằng tốt cho hầu hết bài toán

---

### 3. SINGLE-POINT CROSSOVER HOẠT ĐỘNG THẾ NÀO VỚI BÀI TOÁN XẾP LỊCH?

**Cơ chế:**
```
Parent1: [3, 7, 12, 0, 18]  (Toán→slot3, Lý→slot7, ...)
Parent2: [5, 2, 8, 15, 1]
Point: 2

Child1: [3, 7] + [8, 15, 1] = [3, 7, 8, 15, 1]
Child2: [5, 2] + [12, 0, 18] = [5, 2, 12, 0, 18]
```

**Tại sao hiệu quả:**
- Giữ được "building blocks" (schema) tốt từ cha mẹ
- Ví dụ: Nếu Parent1 có 3 môn đầu xếp tốt, Child1 kế thừa được
- Đơn giản, nhanh, ít phá vỡ cấu trúc tốt

**So với các phương pháp khác:**
- Uniform Crossover: Mỗi gen chọn ngẫu nhiên từ cha/mẹ → phá vỡ nhiều hơn
- Two-Point Crossover: Phức tạp hơn, không cải thiện đáng kể

---

### 4. TẠI SAO MUTATION RATE = 10%? QUÁ CAO/THẤP CÓ ẢNH HƯỞNG GÌ?

**Mutation Rate = 10%:**

**Vai trò của Mutation:**
- Duy trì đa dạng gen (genetic diversity)
- Thoát khỏi local optimum
- Khám phá vùng mới trong không gian tìm kiếm

**Nếu quá cao (>30%):**
- Phá vỡ quá nhiều schema tốt
- GA trở thành random search
- Hội tụ rất chậm hoặc không hội tụ
- Mất lợi thế của crossover

**Nếu quá thấp (<5%):**
- Mất đa dạng gen nhanh
- Dễ bị kẹt local optimum
- Không thể thoát khỏi vùng xấu
- Premature convergence

**10% là lý tưởng vì:**
- Đủ để duy trì đa dạng
- Không phá vỡ quá nhiều thông tin tốt
- Cân bằng exploitation (khai thác) và exploration (khám phá)

---

### 5. CONVERGENCE LOG DÙNG ĐỂ LÀM GÌ?

**Convergence Log = List[{"generation": int, "cost": float}]**

**Mục đích:**
1. **Vẽ biểu đồ hội tụ:**
   - Trục X: Thế hệ (generation)
   - Trục Y: Cost (penalty)
   - Quan sát quá trình GA cải thiện nghiệm

2. **Phân tích hiệu quả thuật toán:**
   - Hội tụ nhanh → tham số tốt
   - Hội tụ chậm → cần điều chỉnh
   - Plateau (đường nằm ngang) → có thể bị kẹt local optimum

3. **So sánh các thuật toán:**
   - GA vs Hill Climbing vs SA vs Minimax
   - Xem thuật toán nào hội tụ nhanh hơn, tốt hơn

4. **Debug và tối ưu:**
   - Phát hiện vấn đề (VD: cost tăng lên → bug)
   - Quyết định số thế hệ cần thiết
   - Đánh giá early stopping

**Ví dụ log:**
```python
[
    {"generation": 0, "cost": 2500.0},
    {"generation": 1, "cost": 2200.0},
    {"generation": 2, "cost": 1800.0},
    ...
    {"generation": 150, "cost": 450.0},
    {"generation": 151, "cost": 450.0},  # Đã hội tụ
]
```

**Biểu đồ hội tụ lý tưởng:**
- Giảm nhanh ở đầu (khám phá)
- Giảm chậm dần (tinh chỉnh)
- Ổn định ở cuối (hội tụ)
"""
