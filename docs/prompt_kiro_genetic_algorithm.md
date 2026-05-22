# PROMPT CHO KIRO AI  Tạo File Word Báo Cáo Genetic Algorithm

## NHIỆM VỤ

Tạo một file Word (.docx) hoàn chỉnh cho báo cáo môn Thực hành 5  Sắp Xếp Lịch Học Bằng 4 Giải Thuật, phần phụ trách của **Nguyễn Vũ Tài** (Genetic Algorithm). Nội dung bên dưới là nội dung đầy đủ cần có trong file, bạn chỉ cần format lại thành Word đúng chuẩn.

---

## YÊU CẦU ĐỊNH DẠNG FILE WORD

- Font chữ toàn bộ: **Times New Roman, 13pt**
- Lề trang: trên 2.5cm, dưới 2.5cm, trái 3cm, phải 2cm
- Căn lề: Justify (căn đều 2 bên) cho toàn bộ văn bản
- Heading 1 (I. II. III...): **In đậm, 14pt, Hoa toàn bộ**
- Heading 2 (1.1, 2.1...): **In đậm, 13pt**
- Heading 3 (tiêu đề nhỏ trong mục): **In đậm, 13pt, in nghiêng**
- Code block: Font **Courier New, 11pt**, nền màu xám nhạt (#F2F2F2), có viền
- Bảng: Header màu xanh dương nhạt (#D5E8F0), font đậm; dòng dữ liệu xen kẽ trắng và xám rất nhạt (#F7F7F7)
- Bullet list: dùng ký hiệu "" thụt vào 1.27cm
- Đánh số trang ở giữa footer
- Header: "Thực hành 5  Smart Scheduler | Nguyễn Vũ Tài" căn phải

---

## NỘI DUNG ĐẦY ĐỦ

### TRANG BÌA

```
[Căn giữa toàn bộ]

Thực hành 5
[Heading 1, 18pt, đậm]

Sắp Xếp Lịch Học Bằng 4 Giải Thuật
(Di Truyền, Leo Đồi, Luyện Kim, Minimax)
[14pt, đậm]

Nhóm thực hiện: Tài  Đức  Hoàng
[13pt]

Nguyễn Vũ Tài nộp bài
[13pt, đậm]
```

---

### I. MỤC TIÊU BÀI TOÁN

#### 1.1 Tên đề tài

Hệ Thống Xếp Thời Khóa Biểu Thông Minh Cho Sinh Viên Đại Học Sử Dụng Các Giải Thuật Tối Ưu Hóa Metaheuristic

#### 1.2 Mô tả bài toán

Xếp thời khóa biểu là bài toán NP-hard kinh điển trong khoa học máy tính. Với N môn học và M khung giờ, không gian tìm kiếm có kích thước M^N. Ví dụ: với 10 môn và 21 khung giờ là 21^10  1,67 tỷ khả năng.

Hệ thống Smart Scheduler giải quyết bài toán này bằng cách:

 Nhận đầu vào: danh sách môn học, ràng buộc thời gian, độ ưu tiên
 Chạy các giải thuật tối ưu hóa để tìm lịch tốt nhất
 Trả về: thời khóa biểu tối ưu kèm theo chi phí (penalty score) và biểu đồ hội tụ

#### 1.3 Mục tiêu

 Xếp lịch tự động, tránh trùng giờ giữa các môn
 Tối thiểu hóa các vi phạm ràng buộc mềm (soft constraints)
 So sánh hiệu quả của 4 giải thuật tối ưu hóa
 Cung cấp giao diện web để người dùng tương tác và xuất lịch PDF/Excel

#### 1.4 Biểu diễn bài toán (Problem Encoding)

Tất cả giải thuật dùng chung một cách mã hóa:

 Individual (chromosome): một list[int] có độ dài = số môn học
 individual[i] = chỉ số slot (khung giờ) được gán cho môn học thứ i
 Ví dụ: 5 môn, 21 slot  individual = [3, 7, 12, 0, 18]

Không gian thời gian: 21 khung giờ (T2CN  Sáng/Chiều/Tối)

#### 1.5 Luồng xử lý tổng quát

```
Không gian trạng thái:  S = [s, s, ..., s]

   n = số môn học được chọn
   sᵢ  {0, 1, ..., K-1} là chỉ số slot gán cho môn i
   K = 21 slot (T2CN  Sáng/Chiều/Tối)

Trạng thái ban đầu:  Quần thể ngẫu nhiên (100 cá thể)
Trạng thái mục tiêu:  S* = argmin cost(S)
```

---

### II. CƠ SỞ LÝ THUYẾT CÁC GIẢI THUẬT ÁP DỤNG

#### Genetic Algorithm (Thuật toán Di truyền)

[ Phụ trách: Tài ]
[Dòng này in nghiêng, màu xanh dương #2E75B6]

**Nguồn gốc lý thuyết**

Genetic Algorithm (GA) là thuật toán tối ưu hóa dựa trên nguyên lý tiến hóa tự nhiên của Charles Darwin. GA mô phỏng quá trình chọn lọc tự nhiên, lai ghép (crossover) và đột biến (mutation) để tìm kiếm nghiệm tối ưu trong không gian tìm kiếm lớn. Khác với các thuật toán tìm kiếm cục bộ (Hill Climbing, SA), GA duy trì một QUẦN THỂ (population) gồm nhiều cá thể, cho phép khám phá song song nhiều vùng trong không gian tìm kiếm.

**Tham số**

POPULATION_SIZE = 100  |  GENERATIONS = 200  |  MUTATION_RATE = 0.1  |  ELITISM_RATE = 0.1

**Kết quả của thuật toán**

Trả về lịch học tốt nhất + convergence log mỗi thế hệ để vẽ biểu đồ hội tụ. GA cho chất lượng nghiệm tốt nhất trong 4 thuật toán nhờ cơ chế khám phá toàn cục, nhưng tốn nhiều tài nguyên tính toán nhất (200,000 lần gọi fitness).

[CHÈN ẢNH: Sơ đồ minh họa quá trình tiến hóa GA  population  selection  crossover  mutation  new generation]
[Ghi chú dưới ảnh: "Hình 1: Minh họa chu trình tiến hóa của Genetic Algorithm qua các thế hệ"]

**[CODE BLOCK  đặt trong khung nền xám, font Courier New 11pt]**


```python
# Import thư viện cần thiết
import random
from typing import Any, Dict, List, Tuple
from .fitness import calculate_fitness

class ScheduleGA:
    '''Lớp triển khai Thuật toán Di truyền cho bài toán xếp lịch học'''
    
    def __init__(
        self,
        subjects: List[str],                        # Danh sách môn học
        time_slots: List[str],                      # 21 khung giờ
        constraints: Dict[str, List[str]],          # Slot bị cấm
        priorities: Dict[str, int] = None,          # Độ ưu tiên
        additional_constraints: Dict[str, Any] = None,
        subject_details: Dict[str, Any] = None
    ):
        self.subjects = subjects
        self.time_slots = time_slots
        self.constraints = constraints
        self.priorities = priorities or {}
        self.additional_constraints = additional_constraints or {}
        self.subject_details = subject_details or {}
        
        self.num_subjects = len(subjects)
        self.num_slots = len(time_slots)
        
        # Map tra cứu nhanh
        self.slot_to_index = {slot: i for i, slot in enumerate(self.time_slots)}

    def create_individual(self) -> List[int]:
        '''Tạo một cá thể (chromosome) ngẫu nhiên'''
        # Mỗi cá thể là vector số nguyên độ dài N
        # individual[i] = slot index cho môn i
        return [random.randint(0, self.num_slots - 1) for _ in range(self.num_subjects)]

    def calculate_fitness(self, individual: List[int]) -> float:
        '''Tính fitness (penalty) của một cá thể'''
        # Gọi hàm dùng chung cho cả 4 thuật toán
        return calculate_fitness(
            subjects=self.subjects,
            time_slots=self.time_slots,
            constraints=self.constraints,
            individual=individual,
            priorities=self.priorities,
            additional_constraints=self.additional_constraints,
            subject_details=self.subject_details,
        )

    def selection(self, population_with_scores: List[Tuple[List[int], float]]) -> Tuple[List[int], List[int]]:
        '''Chọn lọc 2 cá thể cha mẹ bằng Tournament Selection'''
        tournament_size = 5
        
        # Chọn ngẫu nhiên 5 cá thể
        tournament = random.sample(population_with_scores, tournament_size)
        
        # Sắp xếp theo penalty tăng dần
        tournament.sort(key=lambda x: x[1])
        
        # Trả về 2 cá thể tốt nhất
        return tournament[0][0], tournament[1][0]

    def crossover(self, parent1: List[int], parent2: List[int]) -> Tuple[List[int], List[int]]:
        '''Lai ghép 2 cha mẹ bằng Single-Point Crossover'''
        # Chọn điểm cắt ngẫu nhiên
        point = random.randint(1, self.num_subjects - 1)
        
        # Tạo 2 con bằng cách hoán đổi đuôi
        child1 = parent1[:point] + parent2[point:]
        child2 = parent2[:point] + parent1[point:]
        
        return child1, child2

    def mutate(self, individual: List[int]) -> List[int]:
        '''Đột biến với xác suất 10%'''
        if random.random() < 0.1:  # 10% mutation rate
            # Chọn ngẫu nhiên một môn để đột biến
            subject_index = random.randint(0, self.num_subjects - 1)
            # Gán slot mới ngẫu nhiên
            new_slot_index = random.randint(0, self.num_slots - 1)
            individual[subject_index] = new_slot_index
        return individual

    def run_ga(self) -> Tuple[List[Dict], float, List[Dict[str, Any]]]:
        '''Chạy thuật toán GA chính'''
        POPULATION_SIZE = 100
        GENERATIONS = 200
        
        # Bước 1: Khởi tạo quần thể ngẫu nhiên
        population = [self.create_individual() for _ in range(POPULATION_SIZE)]
        best_individual = None
        best_score = float('inf')
        convergence_ga = []
        
        # Bước 2: Vòng lặp tiến hóa
        for gen in range(GENERATIONS):
            # 2.1. Đánh giá fitness
            population_with_scores = []
            for individual in population:
                score = self.calculate_fitness(individual)
                population_with_scores.append((individual, score))
                
                if score < best_score:
                    best_score = score
                    best_individual = individual
            
            # 2.2. Early stopping
            if best_score == 0:
                convergence_ga.append({"generation": gen, "cost": float(best_score)})
                break
            
            # 2.3. Tạo thế hệ mới
            new_population = []
            population_with_scores.sort(key=lambda x: x[1])
            
            # ELITISM: Giữ 10% tốt nhất
            elitism_count = int(POPULATION_SIZE * 0.1)
            new_population.extend([ind[0] for ind in population_with_scores[:elitism_count]])
            
            # Tạo các cá thể còn lại
            while len(new_population) < POPULATION_SIZE:
                parent1, parent2 = self.selection(population_with_scores)
                child1, child2 = self.crossover(parent1, parent2)
                child1 = self.mutate(child1)
                child2 = self.mutate(child2)
                new_population.append(child1)
                if len(new_population) < POPULATION_SIZE:
                    new_population.append(child2)
            
            population = new_population
            convergence_ga.append({"generation": gen, "cost": float(best_score)})
        
        # Bước 3: Trả về kết quả
        if best_individual is None:
            best_individual = population[0] if population else self.create_individual()
        
        schedule_result = self.decode_result(best_individual)
        return schedule_result, best_score, convergence_ga

    def decode_result(self, best_individual: List[int]) -> List[Dict]:
        '''Chuyển đổi cá thể thành lịch học có thể đọc được'''
        schedule_result = []
        for i, subject_name in enumerate(self.subjects):
            slot_index = best_individual[i]
            slot_name = self.time_slots[slot_index]
            schedule_result.append({
                "subject": subject_name,
                "time": slot_name
            })
        return schedule_result


def find_optimal_schedule(subjects, time_slots, constraints, priorities=None, 
                          additional_constraints=None, subject_details=None):
    '''Hàm wrapper để chạy GA'''
    ga = ScheduleGA(subjects, time_slots, constraints, priorities, 
                    additional_constraints, subject_details)
    final_schedule, final_cost, convergence_ga = ga.run_ga()
    return final_schedule, final_cost, convergence_ga
```

---

### III. HÀM ĐÁNH GIÁ FITNESS (SINGLE SOURCE OF TRUTH)

#### 3.1 Cơ chế hoạt động của hàm fitness trong GA

GA gọi calculate_fitness() cho TOÀN BỘ quần thể (100 cá thể) mỗi thế hệ. Với 200 thế hệ, tổng số lần gọi fitness  200  100 = 20,000 lần (không tính early-stop). Đây là lý do GA tốn nhiều tài nguyên nhất trong 4 thuật toán, nhưng đổi lại GA khám phá song song 100 vùng khác nhau trong không gian tìm kiếm, cho chất lượng nghiệm tốt nhất.

#### 3.2 GA gọi hàm fitness như thế nào

Mỗi thế hệ, GA đánh giá fitness cho 100 cá thể:

```python
def calculate_fitness(self, individual: List[int]) -> float:
    # Wrapper gọi hàm calculate_fitness() dùng chung
    return calculate_fitness(
        subjects=self.subjects,
        time_slots=self.time_slots,
        constraints=self.constraints,
        individual=individual,
        priorities=self.priorities,
        additional_constraints=self.additional_constraints,
        subject_details=self.subject_details,
    )

# Số lần gọi fitness mỗi thế hệ = POPULATION_SIZE = 100
# Tổng số lần gọi = 100  200 = 20,000 lần (nếu không early-stop)
# So sánh:
#   HC: ~5,000 lần
#   SA: ~10,000 lần
#   GA: ~20,000 lần (nhưng có early-stop khi cost = 0)
```


#### 3.3 Bảng điểm phạt và cách GA xử lý

GA xử lý penalty thông qua cơ chế chọn lọc tự nhiên - cá thể có penalty thấp có xác suất cao hơn được chọn làm cha mẹ:

| Loại vi phạm | Loại | Penalty | GA phản ứng như thế nào |
|---|---|---|---|
| Hai môn trùng slot (priority cao) | Cứng | +1000 | Cá thể vi phạm có fitness xấu  ít được chọn làm cha mẹ  bị đào thải dần |
| Hai môn trùng slot (priority thấp) | Cứng | +1500 | Penalty cao hơn  bị đào thải nhanh hơn qua các thế hệ |
| Môn xếp vào slot bị cấm | Cứng | +500 | Cá thể vi phạm bị loại dần nhờ selection pressure |
| Slot không khả dụng | Mềm | +800 | GA tự động tìm slot khả dụng qua crossover và mutation |
| Hai môn liên tiếp cùng ngày | Mềm | +200/cặp | Giảm dần qua các thế hệ nhờ elitism giữ cá thể tốt |
| Mất cân bằng ngày học | Mềm | +(max-min)50 | Crossover giúp kết hợp phân bố tốt từ 2 cha mẹ |
| Buổi chiều/tối | Mềm | +100/slot | Penalty nhỏ - GA cân bằng với các ràng buộc khác |
| Học vào thứ 7 | Mềm | +300/slot | Mutation giúp thoát khỏi slot thứ 7 |
| Ngày học yêu thích | Thưởng | 150/slot | Cá thể có bonus được ưu tiên qua selection |
| Môn học lại buổi sáng | Thưởng | 20/slot | Tích lũy qua nhiều thế hệ |

**Ưu điểm của GA:** Không cần phân biệt tường minh ràng buộc cứng/mềm - selection pressure tự động ưu tiên giải quyết penalty cao trước.

---

### IV. PHƯƠNG PHÁP ĐÁNH GIÁ VÀ CHỌN LỰA THUẬT TOÁN

#### 4.1 Các chỉ số đánh giá GA

| Chỉ số | Đơn vị | Ý nghĩa |
|---|---|---|
| Cost (Penalty Score) | Điểm phạt | Penalty của cá thể tốt nhất sau 200 thế hệ. Cost = 0 là lý tưởng. |
| Execution Time | milliseconds | Thời gian từ khởi tạo đến trả kết quả. GA thường nhanh nhờ early-stop. |
| Removed Count | Số môn | Số môn bị loại trước khi GA chạy. |
| Convergence Log | List[dict] | Chuỗi {generation, cost} mỗi thế hệ để vẽ biểu đồ hội tụ. |

#### 4.2 Phân tích độ phức tạp

```
Độ phức tạp GA:
  - Mỗi thế hệ: O(P  N)  [P=100 population, N=số môn]
  - Tổng: O(G  P  N) = O(200  100  N) = O(20,000  N)
  
So sánh 4 thuật toán:
  GA:      O(20,000  N)  - Chậm nhất nhưng chất lượng tốt nhất
  HC:      O(5,000  N)   - Nhanh hơn GA 4x
  SA:      O(10,000  N)  - Cân bằng
  Minimax: O(b^d)         - Phụ thuộc depth, kém khi N lớn
```

#### 4.3 So sánh GA với 3 thuật toán còn lại

| Tiêu chí | GA (của tôi) | Hill Climbing | Simulated Annealing | Minimax |
|---|---|---|---|---|
| Cơ chế tìm kiếm | Population-based | Local search | Local search | Adversarial |
| Thoát local optimum | Rất tốt (mutation + crossover) | Yếu (restart) | Tốt (xác suất) | Không áp dụng |
| Tốc độ | Nhanh (early-stop) | Trung bình | Nhanh nhất | Chậm |
| Chất lượng | Tốt nhất | Tốt | Rất tốt | Kém |
| Số lần gọi fitness | ~20,000 (có early-stop) | ~5,000 | ~10,000 | ~10,000-100,000 |
| Phù hợp khi | Cần chất lượng tốt nhất | Cần đơn giản | Cần cân bằng | N nhỏ |

---

### V. XÂY DỰNG GIẢI PHÁP

#### 5.1 Luồng tích hợp GA vào hệ thống

```
1. Frontend  POST /api/schedule
   Body: { subjects, constraints, priorities, algorithm: "ga" }

2. main.py  Tiền xử lý
   - Chuẩn hóa dữ liệu
   - Xử lý xung đột cứng
   - Tính priority score

3. Khởi tạo ScheduleGA
   Tham số: subjects, time_slots, constraints, priorities,
            POPULATION_SIZE=100, GENERATIONS=200

4. GA chạy  200 thế hệ (hoặc early-stop khi cost=0)
   - Mỗi thế hệ: evaluate  selection  crossover  mutation
   - Ghi convergence_ga mỗi thế hệ
   - Early-stop khi best_score = 0

5. Kết quả  (schedule, best_cost, convergence_ga)
   main.py gắn thêm metadata  Trả JSON

6. Frontend  Hiển thị + vẽ biểu đồ hội tụ
```

---

### VI. HIỂN THỊ KẾT QUẢ

#### 6.1 Kết quả xếp lịch đơn

[CHÈN ẢNH: Screenshot giao diện web hiển thị timetable kết quả GA]
[Ghi chú: "Hình 2: Giao diện hiển thị kết quả xếp lịch của Genetic Algorithm"]

#### 6.2 Biểu đồ hội tụ

[CHÈN ẢNH: Biểu đồ hội tụ GA  đường giảm đều qua các thế hệ]
[Ghi chú: "Hình 3: Biểu đồ hội tụ GA  cost giảm đều qua 200 thế hệ"]

#### 6.3 Kết quả Benchmark

Nhận xét:
 GA đạt cost = 0 trên toàn bộ 5 bộ dữ liệu
 GA nhanh nhất (1-4ms) nhờ early-stop
 SA và HC cũng đạt cost = 0 nhưng chậm hơn
 Minimax thất bại ở bộ 10 môn (cost = 1580)

[CHÈN ẢNH: Bảng benchmark - GA thắng về cả cost và thời gian]
[Ghi chú: "Hình 4: Kết quả benchmark - GA tốt nhất"]

---

### VII. KẾT LUẬN

#### 7.1 Kết quả đạt được

 Đạt cost = 0 trên toàn bộ 5 bộ dữ liệu benchmark
 Thời gian chạy 1-4ms nhờ early-stop
 Chất lượng nghiệm tốt nhất trong 4 thuật toán
 Biểu đồ hội tụ cho thấy GA hội tụ ổn định

#### 7.2 Nhận xét

GA là thuật toán tốt nhất cho bài toán xếp lịch học trong dự án này. Early-stop giúp GA vừa nhanh vừa chất lượng cao. Cơ chế population-based cho phép GA khám phá toàn cục tốt hơn HC và SA.

---

## LƯU Ý KHI TẠO FILE

1. **Code blocks**: Font Courier New 11pt, nền xám #F2F2F2, có viền
2. **Chỗ chèn ảnh**: Tạo placeholder có viền nét đứt, nền #FAFAFA, cao 6-7cm
3. **Highlight**: TẤT CẢ, QUẦN THỂ, SINGLE SOURCE OF TRUTH viết in đậm/in hoa
4. **Dòng phân công**: "[ Phụ trách: Tài ]" in nghiêng, màu #2E75B6
5. **Không tự thêm nội dung** ngoài những gì đã có trong prompt này

