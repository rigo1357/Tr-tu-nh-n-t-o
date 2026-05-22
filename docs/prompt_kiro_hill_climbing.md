# PROMPT CHO KIRO AI – Tạo File Word Báo Cáo Hill Climbing

## NHIỆM VỤ

Tạo một file Word (.docx) hoàn chỉnh cho báo cáo môn Thực hành 5 – Sắp Xếp Lịch Học Bằng 4 Giải Thuật, phần phụ trách của **Lê Anh Đức** (Hill Climbing). Nội dung bên dưới là nội dung đầy đủ cần có trong file, bạn chỉ cần format lại thành Word đúng chuẩn.

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
- Bullet list: dùng ký hiệu "•" thụt vào 1.27cm
- Đánh số trang ở giữa footer
- Header: "Thực hành 5 – Smart Scheduler | Lê Anh Đức" căn phải

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

Nhóm thực hiện: Tài – Đức – Hoàng
[13pt]

Lê Anh Đức nộp bài
[13pt, đậm]
```

---

### I. MỤC TIÊU BÀI TOÁN

#### 1.1 Tên đề tài

Hệ Thống Xếp Thời Khóa Biểu Thông Minh Cho Sinh Viên Đại Học Sử Dụng Các Giải Thuật Tối Ưu Hóa Metaheuristic

#### 1.2 Mô tả bài toán

Xếp thời khóa biểu là bài toán NP-hard kinh điển trong khoa học máy tính. Với N môn học và M khung giờ, không gian tìm kiếm có kích thước M^N. Ví dụ: với 10 môn và 21 khung giờ là 21^10 ≈ 1,67 tỷ khả năng.

Hệ thống Smart Scheduler giải quyết bài toán này bằng cách:

• Nhận đầu vào: danh sách môn học, ràng buộc thời gian, độ ưu tiên
• Chạy các giải thuật tối ưu hóa để tìm lịch tốt nhất
• Trả về: thời khóa biểu tối ưu kèm theo chi phí (penalty score) và biểu đồ hội tụ

#### 1.3 Mục tiêu

• Xếp lịch tự động, tránh trùng giờ giữa các môn
• Tối thiểu hóa các vi phạm ràng buộc mềm (soft constraints)
• So sánh hiệu quả của 4 giải thuật tối ưu hóa
• Cung cấp giao diện web để người dùng tương tác và xuất lịch PDF/Excel

#### 1.4 Biểu diễn bài toán (Problem Encoding)

Tất cả giải thuật dùng chung một cách mã hóa:

• Individual (chromosome): một list[int] có độ dài = số môn học
• individual[i] = chỉ số slot (khung giờ) được gán cho môn học thứ i
• Ví dụ: 5 môn, 21 slot → individual = [3, 7, 12, 0, 18]

Không gian thời gian: 21 khung giờ (T2–CN × Sáng/Chiều/Tối)

#### 1.5 Luồng xử lý tổng quát

[Đây là đoạn code/ký hiệu toán học, dùng code block font Courier New]

```
Không gian trạng thái:  S = [s₁, s₂, ..., sₙ]

  • n = số môn học được chọn
  • sᵢ ∈ {0, 1, ..., K-1} là chỉ số slot gán cho môn i
  • K = 21 slot (T2–CN × Sáng/Chiều/Tối)

Trạng thái ban đầu:  Gán ngẫu nhiên
Trạng thái mục tiêu:  S* = argmin cost(S)
```

---

### II. CƠ SỞ LÝ THUYẾT CÁC GIẢI THUẬT ÁP DỤNG

#### Hill Climbing (Leo Đồi) – Steepest Ascent

[ Phụ trách: Đức ]
[Dòng này in nghiêng, màu xanh dương #2E75B6]

**Nguồn gốc lý thuyết**

Hill Climbing (Leo Đồi) là một kỹ thuật tìm kiếm cục bộ lặp đi lặp lại. Thuật toán bắt đầu từ một trạng thái ngẫu nhiên, sau đó di chuyển liên tục sang trạng thái lân cận có chi phí thấp hơn cho đến khi không còn cải thiện được nữa (cực tiểu cục bộ). Biến thể Steepest-Ascent: mỗi bước đánh giá TẤT CẢ các lân cận và chọn lân cận tốt nhất.

**Tham số**

random_restarts = 50  |  max_iterations = 5000

**Kết quả của thuật toán**

Trả về lịch học tốt nhất + convergence log mỗi 100 bước để vẽ biểu đồ hội tụ. Nhanh hơn GA nhưng dễ bị kẹt cực tiểu cục bộ — random restarts giúp thoát ra.

[CHÈN ẢNH: Sơ đồ minh họa quá trình leo đồi – local optimum vs global optimum]
[Ghi chú dưới ảnh: "Hình 1: Minh họa Hill Climbing bị kẹt tại cực tiểu cục bộ và cơ chế random restart"]

**[CODE BLOCK – đặt trong khung nền xám, font Courier New 11pt]**

```python
# Import thư viện cần thiết
from __future__ import annotations
import random
from typing import Any, Dict, List, Tuple
from .base import BaseScheduler       # Class cha chung cho 4 thuật toán
from .fitness import calculate_fitness # Hàm tính điểm phạt dùng chung

class HillClimbingScheduler(BaseScheduler):

    def __init__(
        self,
        subjects: List[str],                        # Danh sách môn học: ["Toán", "Lý", "Hóa",...]
        time_slots: List[str],                      # 21 khung giờ: ["T2_Sáng", "T2_Chiều",...]
        constraints: Dict[str, List[str]],          # Slot bị cấm của từng môn
        *,
        priorities: Dict[str, int] | None = None,           # Độ ưu tiên từng môn
        additional_constraints: Dict[str, Any] | None = None, # Ràng buộc mềm
        subject_details: Dict[str, Any] | None = None,       # Chi tiết môn
        random_restarts: int = 50,  # Số lần khởi động lại ngẫu nhiên khi bị kẹt
        max_iterations: int = 5000, # Tổng số lần đánh giá tối đa
    ):
        # Gọi __init__ của class cha để khởi tạo các thuộc tính chung
        super().__init__(subjects, time_slots, constraints,
                         priorities=priorities,
                         additional_constraints=additional_constraints,
                         subject_details=subject_details)
        # Lưu các tham số Hill Climbing
        self.random_restarts = random_restarts
        self.max_iterations = max_iterations

    def _random_solution(self) -> List[int]:
        # Tạo lịch ngẫu nhiên ban đầu
        # Mỗi môn được gán 1 slot ngẫu nhiên trong 21 khung giờ
        # VD: 5 môn → [3, 7, 12, 0, 18]
        return [random.randint(0, self.num_slots - 1) for _ in range(self.num_subjects)]

    def get_neighbors(self, solution: List[int]) -> List[List[int]]:
        # Sinh TẤT CẢ lân cận: thay đổi đúng 1 môn sang slot khác
        # Số lân cận = num_subjects × (num_slots - 1)
        # VD: 10 môn × 20 slot = 200 lân cận mỗi bước
        neighbors: List[List[int]] = []
        for i in range(self.num_subjects):  # Duyệt qua từng môn
            current = solution[i]
            for s in range(self.num_slots):
                if s == current:
                    continue  # Bỏ qua slot hiện tại
                n = solution.copy()
                n[i] = s    # Đổi môn i sang slot s
                neighbors.append(n)
        return neighbors

    def _fitness(self, individual: List[int]) -> float:
        # Tính tổng điểm phạt (penalty) của một lịch học
        # Gọi hàm dùng chung cho cả 4 thuật toán trong fitness.py
        return calculate_fitness(
            subjects=self.subjects,
            time_slots=self.time_slots,
            constraints=self.constraints,
            individual=individual,
            priorities=self.priorities,
            additional_constraints=self.additional_constraints,
            subject_details=self.subject_details,
        )

    def _decode(self, best_individual: List[int]) -> List[dict]:
        # Chuyển list số [3, 7, 5, 0, 18] thành dạng đọc được
        # VD: [3, 7, ...] → [{"subject": "Toán", "time": "T3_Sáng"}, ...]
        schedule_result = []
        for i, subject_name in enumerate(self.subjects):
            slot_index = best_individual[i]
            slot_name = self.time_slots[slot_index]
            schedule_result.append({"subject": subject_name, "time": slot_name})
        return schedule_result

    def run(self) -> Tuple[List[dict], float, List[Dict[str, Any]]]:
        # Khởi tạo biến theo dõi lời giải tốt nhất toàn cục
        best_global = None
        best_global_cost = float("inf")
        convergence_hc: List[Dict[str, Any]] = []  # log hội tụ
        iterations_used = 0

        for _restart in range(self.random_restarts):  # vòng lặp restart
            if iterations_used >= self.max_iterations:
                break  # Dừng khi hết ngân sách vòng lặp

            # Khởi tạo lịch ngẫu nhiên cho mỗi lần restart
            current = self._random_solution()
            current_cost = self._fitness(current)

            # Cập nhật lịch tốt nhất nếu lịch khởi động tốt hơn
            if current_cost < best_global_cost:
                best_global_cost = current_cost
                best_global = current

            improved = True
            while improved and iterations_used < self.max_iterations:
                improved = False
                best_neighbor = None
                best_neighbor_cost = current_cost

                # Steepest-ascent: quét TẤT CẢ các thay đổi 1 slot
                for i in range(self.num_subjects):
                    orig = current[i]
                    for s in range(self.num_slots):
                        if s == orig:
                            continue
                        neighbor = current.copy()
                        neighbor[i] = s
                        c = self._fitness(neighbor)
                        iterations_used += 1

                        # Ghi log hội tụ mỗi 100 vòng lặp
                        if iterations_used % 100 == 0:
                            convergence_hc.append({"iteration": iterations_used,
                                                   "cost": float(best_global_cost)})

                        # Cập nhật lân cận tốt nhất nếu tìm thấy cải thiện
                        if c < best_neighbor_cost:
                            best_neighbor_cost = c
                            best_neighbor = neighbor

                        if iterations_used >= self.max_iterations:
                            break
                    if iterations_used >= self.max_iterations:
                        break

                # Di chuyển sang lân cận tốt nhất nếu có cải thiện
                if best_neighbor is not None and best_neighbor_cost < current_cost:
                    current = best_neighbor
                    current_cost = best_neighbor_cost
                    improved = True
                    if current_cost < best_global_cost:
                        best_global_cost = current_cost
                        best_global = current

                # Nếu không tìm được cải thiện → bị kẹt cực tiểu cục bộ → restart

        if best_global is None:
            best_global = self._random_solution()
            best_global_cost = self._fitness(best_global)

        # Thêm điểm cuối vào log hội tụ
        convergence_hc.append({"iteration": iterations_used, "cost": float(best_global_cost)})

        return self._decode(best_global), float(best_global_cost), convergence_hc
```

---

### III. HÀM ĐÁNH GIÁ FITNESS (SINGLE SOURCE OF TRUTH)

#### 3.1 Cơ chế hoạt động của hàm fitness trong Hill Climbing

Khác với Simulated Annealing chỉ đánh giá một neighbor ngẫu nhiên mỗi bước, Hill Climbing theo chiến lược Steepest Ascent phải gọi calculate_fitness() cho toàn bộ tập lân cận trước khi quyết định di chuyển. Điều này có nghĩa mỗi bước leo tốn O(N × K) lần tính fitness, trong đó N là số môn và K = 21 slot — đây chính là lý do HC chậm hơn SA nhưng đảm bảo luôn chọn được bước đi tốt nhất có thể trong vùng lân cận.

#### 3.2 HC gọi hàm fitness như thế nào

Trong mỗi bước of vòng while improved, HC không sinh 1 neighbor mà duyệt qua tất cả (num_subjects × num_slots) khả năng thay thế:

**[CODE BLOCK]**

```python
def _fitness(self, individual: List[int]) -> float:
    # Wrapper gọi hàm calculate_fitness() dùng chung cho cả 4 thuật toán
    return calculate_fitness(
        subjects=self.subjects,           # Danh sách môn học
        time_slots=self.time_slots,        # 21 khung giờ T2–CN × Sáng/Chiều/Tối
        constraints=self.constraints,      # Slot bị cấm theo cấu hình người dùng
        individual=individual,             # Lịch cần chấm điểm, e.g. [3,7,12,0,18]
        priorities=self.priorities,        # Trọng số ưu tiên từng môn
        additional_constraints=self.additional_constraints,
        subject_details=self.subject_details,
    )

# Số lần gọi _fitness() trong 1 bước leo (steepest-ascent step):
#   = num_subjects × (num_slots - 1)
#   VD: 10 môn × 20 slot = 200 lần/bước → rất tốn kém so với SA (1 lần/bước)
#   → Đây là trade-off: HC chắc chắn hơn nhưng đắt hơn về tính toán
```

#### 3.3 Bảng điểm phạt (Penalty) và cách HC xử lý từng loại

HC không có cơ chế xác suất chấp nhận lân cận xấu như SA. Vì vậy, mọi quyết định di chuyển đều phụ thuộc hoàn toàn vào tổng penalty — bảng dưới đây cho thấy trọng số và cách HC phản ứng với từng loại vi phạm:

[BẢNG 4 CỘT – header: Loại vi phạm | Loại | Penalty | HC phản ứng như thế nào]

| Loại vi phạm | Loại | Penalty | HC phản ứng như thế nào |
|---|---|---|---|
| Hai môn trùng slot (priority cao) | Cứng | +1000 | Lân cận này luôn bị bỏ qua vì cost quá cao; HC không bao giờ di chuyển vào đây |
| Hai môn trùng slot (priority thấp) | Cứng | +1500 | Penalty cao hơn buộc HC ưu tiên giải quyết ngay khi tìm neighbor |
| Môn xếp vào slot bị cấm | Cứng | +500 | Neighbor vi phạm slot cấm bị loại ngầm do cost luôn cao hơn neighbor hợp lệ |
| Slot không khả dụng (unavailable_slots) | Mềm | +800 | HC chủ động tìm neighbor thay thế slot bận của giảng viên ở mỗi bước leo |
| Hai môn liên tiếp cùng ngày (avoidConsecutive) | Mềm | +200/cặp | HC dần loại bỏ qua các bước leo; không chấp nhận tạm thời như SA |
| Mất cân bằng ngày học (balanceDays) | Mềm | +(max-min)×50 | Ảnh hưởng tích lũy; HC điều chỉnh phân bố ngày học qua nhiều restart |
| Buổi chiều/tối (preferMorning) | Mềm | +100/slot | Penalty nhỏ — HC có thể bỏ qua nếu không có neighbor sáng nào tốt hơn |
| Học vào thứ 7 (allowSaturday=false) | Mềm | +300/slot | HC tránh thứ 7 một cách tự nhiên mà không cần cơ chế đặc biệt |
| Ngày học yêu thích khớp (preferred_days) | Thưởng | −150/slot | HC hội tụ tới các slot preferred vì chúng giảm cost → được chọn làm neighbor tốt nhất |
| Môn học lại xếp buổi sáng (is_retake) | Thưởng | −20/slot | Bonus nhỏ tích lũy dần; HC ưu tiên slot sáng cho môn học lại qua nhiều bước |

**Lưu ý quan trọng:** Toàn bộ penalty được cộng vào một con số duy nhất — HC không tường minh phân biệt ràng buộc cứng/mềm. Tuy nhiên, vì penalty cứng (500–1500) cao hơn hẳn penalty mềm (100–300), HC tự động ưu tiên loại bỏ xung đột nghiêm trọng trước. Đây là một thiết kế thông minh: đơn giản về code nhưng vẫn đảm bảo thứ tự ưu tiên đúng trong thực tế.

---

### IV. PHƯƠNG PHÁP ĐÁNH GIÁ VÀ CHỌN LỰA THUẬT TOÁN

#### 4.1 Các chỉ số đánh giá Hill Climbing

Sau mỗi lần chạy, hệ thống thu thập 4 chỉ số sau để đánh giá chất lượng lời giải và hiệu năng của HC:

[BẢNG 3 CỘT – header: Chỉ số | Đơn vị | Ý nghĩa và cách đọc kết quả]

| Chỉ số | Đơn vị | Ý nghĩa và cách đọc kết quả |
|---|---|---|
| Cost (Penalty Score) | Điểm phạt | Tổng penalty của lịch tốt nhất HC tìm được qua toàn bộ các restart. Cost = 0 nghĩa là không vi phạm bất kỳ ràng buộc nào — đây là mục tiêu lý tưởng. |
| Execution Time | milliseconds | Thời gian thực tế từ khi khởi tạo HillClimbingScheduler đến khi trả về kết quả. Bao gồm toàn bộ 50 restart × nhiều bước leo. |
| Removed Count | Số môn | Số môn bị loại trước khi HC chạy, do xung đột thời gian cứng không thể giải quyết tự động bằng session thay thế. |
| Convergence Log | List[dict] | Chuỗi {iteration, cost} ghi lại mỗi 100 bước — dùng để vẽ biểu đồ hội tụ trên frontend, giúp trực quan hóa tốc độ cải thiện của HC. |

#### 4.2 Phân tích độ phức tạp và so sánh 4 giải thuật

**A) Độ phức tạp Hill Climbing (Steepest Ascent)**

Không giống SA chỉ sinh 1 neighbor/bước, HC đánh giá toàn bộ không gian lân cận trước mỗi bước di chuyển:

**[CODE BLOCK – font Courier New, nền xám]**

```
Mỗi bước leo đồi:
  - Sinh và đánh giá: num_subjects × (num_slots - 1) neighbors
  - Fitness mỗi neighbor:  O(N²)  [N = số môn, do check trùng slot]
  → Chi phí mỗi bước:     O(N² × N × K) = O(N³ × K)

Với tham số mặc định (R=50 restarts, I tối đa 5000 fitness calls):
  → Độ phức tạp toàn bộ HC:  O(R × I × N × K)
     = O(50 × 5000 × N × 21)  ≈ O(5.25M × N)  với N = số môn

So sánh với các thuật toán khác trong dự án:
  GA:      O(P × G × N)       [P=100 pop, G=200 gen]      → nhanh hơn nhờ early-stop
  SA:      O(I × N)           [I=10.000]                  → nhanh hơn HC ~10-20x
  Minimax: O(b^d)             [b=branch, d=depth]         → kém nhất khi N lớn
```

**B) So sánh HC với 3 thuật toán còn lại trong dự án**

[BẢNG 5 CỘT – header: Tiêu chí | HC (của tôi) | Simulated Annealing | Genetic Algorithm | Minimax + α-β]

| Tiêu chí | HC (của tôi) | Simulated Annealing | Genetic Algorithm | Minimax + α-β |
|---|---|---|---|---|
| Neighbor/bước | TẤT CẢ N×K | 1 ngẫu nhiên | Cả population | Theo nhánh cây |
| Thoát local opt. | Random restart ×50 | Xác suất exp(−Δ/T) | Đột biến + lai ghép | Alpha-Beta pruning |
| Tốc độ | Trung bình (85ms) | Nhanh nhất (50ms) | Nhanh do early-stop | Chậm khi N>6 |
| Chất lượng lời giải | Tốt – bước di chuyển chắc | Rất tốt | Tốt nhất toàn cục | Kém khi N lớn |
| Tính tất định | Không | Không | Không | Có |
| Biểu đồ hội tụ | Có | Có | Có | Không |
| Phù hợp khi | Cần chắc chắn mỗi bước di chuyển | Cần cân bằng tốc độ/chất lượng | Cần tối ưu toàn cục | N nhỏ, cần deterministic |

#### 4.3 Nhận xét và phân tích điểm mạnh – điểm yếu của HC

• **Điểm mạnh:** HC đảm bảo mỗi bước di chuyển là bước tốt nhất có thể trong vùng lân cận — không bao giờ đi lùi. Điều này khiến HC hội tụ nhanh và ổn định trong giai đoạn đầu.

• **Điểm yếu:** Chính vì không chấp nhận lân cận xấu hơn, HC dễ bị kẹt tại cực tiểu cục bộ. Cơ chế random restart giúp giảm thiểu nhưng không triệt tiêu hoàn toàn rủi ro này.

• **So với GA:** GA tìm kiếm toàn cục tốt hơn nhờ cơ chế population, nhưng HC đơn giản hơn nhiều về mặt cài đặt và debug. Với bài toán nhỏ (dưới 10 môn), HC cho kết quả tương đương GA.

• **So với SA:** SA linh hoạt hơn nhờ cơ chế nhiệt độ, nhưng HC có lợi thế là dễ phân tích và dễ dự đoán hành vi — mỗi bước luôn cải thiện hoặc không di chuyển.

---

### V. XÂY DỰNG GIẢI PHÁP BÀI TOÁN

#### 5.1 Luồng tích hợp HC vào hệ thống Smart Scheduler

Khi người dùng chọn thuật toán Hill Climbing trên giao diện web, hệ thống thực hiện chuỗi xử lý sau — mỗi bước được thiết kế để tách biệt rõ trách nhiệm:

**[CODE BLOCK – font Courier New, nền xám]**

```
1. Frontend  →  POST /api/schedule
   Body: { subjects, constraints, priorities, algorithm: "hc" }

2. main.py  →  Tiền xử lý (trước khi HC chạy)
   - Chuẩn hóa ngày học (T2–CN → index 0–6)
   - Tính priority score từ số tín chỉ + is_retake + user_priority
   - Phát hiện xung đột thời gian cứng giữa các môn
   - Tự động đổi session thay thế nếu khả thi
   - Loại môn priority thấp nếu không có session thay thế → removed_conflicts

3. _run_scheduler_algorithm("hc", ...)  →  Khởi tạo HillClimbingScheduler
   Tham số: subjects (đã làm sạch), time_slots, constraints,
            priorities, additional_constraints, subject_details,
            random_restarts=50, max_iterations=5000

4. HC chạy  →  50 restarts × nhiều bước leo đồi
   - Mỗi restart: random solution → steepest ascent đến local optimum
   - Ghi convergence_hc mỗi 100 fitness calls
   - Cập nhật best_global khi tìm thấy lời giải tốt hơn

5. Kết quả  →  (schedule, best_cost, convergence_hc)
   main.py gắn thêm: giảng viên, ngày bắt đầu, màu sắc môn học
   → Trả JSON về frontend

6. Frontend  →  Hiển thị timetable + vẽ biểu đồ hội tụ từ convergence_hc
```

[CHÈN ẢNH: Sơ đồ luồng xử lý từ Frontend → Backend → HC → trả kết quả]
[Ghi chú: "Hình 2: Luồng tích hợp Hill Climbing vào hệ thống Smart Scheduler"]

#### 5.2 Cơ chế xử lý xung đột trước khi HC nhận dữ liệu

HC được thiết kế chỉ nhận danh sách môn đã qua tiền xử lý — không có xung đột thời gian cứng. Lý do: nếu HC nhận cả các môn xung đột, penalty +1000/+1500 sẽ chi phối toàn bộ quá trình tối ưu, khiến HC lãng phí phần lớn ngân sách iteration vào việc cố giải quyết xung đột không thể tránh. Quy trình tiền xử lý gồm 3 bước:

**[CODE BLOCK]**

```
Bước 1: Phát hiện xung đột
  - So sánh từng cặp môn: trùng ngày + giờ + trong khoảng date_range
  - Nếu phát hiện xung đột → đánh dấu cặp môn có vấn đề

Bước 2: Giải quyết tự động
  - Giữ lại môn có priority cao hơn
  - Tìm session thay thế cho môn còn lại trong database
  - Nếu tìm được → cập nhật time_slots và constraints tương ứng

Bước 3: Loại môn nếu cần
  - Không tìm được session thay thế → loại môn priority thấp
  - Ghi vào removed_conflicts (trả về frontend để thông báo người dùng)
  - HC chỉ nhận danh sách môn sạch → 100% tập trung tối ưu soft constraints
```

---

### VI. HIỂN THỊ KẾT QUẢ VÀ ĐÁNH GIÁ, SO SÁNH

#### 6.1 Kết quả xếp lịch đơn

API trả về đầy đủ: lịch học theo slot, chi phí penalty, danh sách môn bị loại, môn được đổi session tự động, convergence log để vẽ biểu đồ hội tụ.

[CHÈN ẢNH: Screenshot giao diện web hiển thị timetable kết quả Hill Climbing]
[Ghi chú: "Hình 3: Giao diện hiển thị kết quả xếp lịch của Hill Climbing"]

#### 6.2 Bảng so sánh 4 giải thuật (API /compare)

Chạy cùng một đầu vào qua 4 giải thuật, hệ thống tự động xác định thuật toán tốt nhất (cost thấp nhất):

[CHÈN ẢNH: Screenshot bảng so sánh 4 giải thuật trên giao diện web]
[Ghi chú: "Hình 4: Bảng so sánh kết quả 4 giải thuật cùng đầu vào"]

#### 6.3 Biểu đồ hội tụ (Convergence Chart)

Frontend dùng Recharts vẽ biểu đồ đường sau khi chạy HC:

• Trục X: Bước lặp (iterations)
• Trục Y: Chi phí (penalty score)
• Đường đi xuống theo bậc thang = HC tìm được lời giải tốt hơn sau mỗi restart

[CHÈN ẢNH: Biểu đồ hội tụ Hill Climbing – đường gấp khúc đi xuống theo từng bước]
[Ghi chú: "Hình 5: Biểu đồ hội tụ Hill Climbing – cost giảm theo từng restart"]

#### 6.4 Kết quả Benchmark

Nhận xét từ kết quả thực nghiệm:

• SA đạt cost = 0 trên toàn bộ 5 bộ dữ liệu, thời gian dao động 21–44ms.
• SA nhanh hơn HC từ 1.1 đến 2.3 lần tùy bộ dữ liệu.
• Chỉ có Minimax thất bại ở bộ 10 môn (cost = 80) do vượt giới hạn depth.
• GA luôn nhanh nhất (1–4ms) do có cơ chế early-stop khi cost = 0, SA chưa có cơ chế này.

SA và HC đều đạt cost = 0, nhưng SA nhanh hơn HC gần 1.7 lần (55ms vs 95ms). Minimax thất bại nặng nhất với cost = 1580 — cho thấy giới hạn của thuật toán khi số môn vượt depth limit. GA thắng nhờ early-stop.

[CHÈN ẢNH: Bảng benchmark 5 bộ dữ liệu – so sánh cost và thời gian 4 giải thuật]
[Ghi chú: "Hình 6: Kết quả benchmark 4 giải thuật trên 5 bộ dữ liệu chuẩn"]

---

### VII. KẾT LUẬN

#### 7.1 Kết quả đạt được

Thuật toán Hill Climbing (Steepest Ascent) được triển khai thành công trong hệ thống Smart Scheduler với các kết quả đo lường thực tế như sau:

• Đạt cost = 0 trên toàn bộ 5 bộ dữ liệu benchmark (3, 5, 7, 10, 12 môn), không vi phạm bất kỳ ràng buộc cứng nào.
• Thời gian chạy 85–100ms, nhanh hơn GA từ 20 đến 50 lần do GA có cơ chế early-stop.
• Biểu đồ hội tụ xác nhận HC hội tụ nhanh trong giai đoạn đầu rồi ổn định — minh chứng trực quan cho cơ chế steepest ascent với random restarts.

#### 7.2 Nhận xét so sánh

GA luôn thắng về tốc độ nhờ early-stop — khi tìm được cost = 0 thì dừng ngay, HC thì phải đánh giá toàn bộ lân cận mỗi bước. Đây là điểm HC thua GA và SA trong dự án này về hiệu năng thuần túy. Bù lại, HC đảm bảo tìm được cực tiểu cục bộ tốt nhất trong vùng lân cận và không bị giới hạn depth như Minimax.

---

## LƯU Ý KHI TẠO FILE

1. **Code blocks**: Tất cả đoạn code Python và pseudo-code phải dùng font Courier New 11pt, nền xám #F2F2F2, có viền đơn xám, padding 8pt trên dưới và 12pt trái phải.

2. **Chỗ chèn ảnh**: Tạo một ô placeholder có viền nét đứt, nền xám rất nhạt (#FAFAFA), chiều cao khoảng 6–7cm, ở giữa ghi chữ nhỏ màu xám: "[Chèn ảnh tại đây]" và ghi chú hình bên dưới ô.

3. **Highlight text**: Những từ TẤT CẢ, SINGLE SOURCE OF TRUTH, Steepest Ascent viết in đậm hoặc in hoa để nhấn mạnh.

4. **Dòng phân công**: Dòng "[ Phụ trách: Đức ]" in nghiêng, màu xanh dương #2E75B6, không đậm.

5. **Không tự thêm nội dung**: Không thêm bất kỳ nội dung, nhận xét hay giải thích nào ngoài những gì đã có trong prompt này.
