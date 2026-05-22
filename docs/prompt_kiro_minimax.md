# PROMPT CHO KIRO AI  Tạo File Word Báo Cáo Minimax + Alpha-Beta Pruning

## NHIỆM VỤ

Tạo một file Word (.docx) hoàn chỉnh cho báo cáo môn Thực hành 5  Sắp Xếp Lịch Học Bằng 4 Giải Thuật, phần phụ trách của **Nguyễn Hoàng** (Minimax + Alpha-Beta Pruning). Nội dung bên dưới là nội dung đầy đủ cần có trong file, bạn chỉ cần format lại thành Word đúng chuẩn.

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
- Header: "Thực hành 5  Smart Scheduler | Nguyễn Hoàng" căn phải

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

Nguyễn Hoàng nộp bài
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

Trạng thái ban đầu:  Cây trò chơi với MAX/MIN players
Trạng thái mục tiêu:  S* = minimax value với alpha-beta pruning
```

---

### II. CƠ SỞ LÝ THUYẾT CÁC GIẢI THUẬT ÁP DỤNG

#### Minimax + Alpha-Beta Pruning

[ Phụ trách: Hoàng ]
[Dòng này in nghiêng, màu xanh dương #2E75B6]

**Nguồn gốc lý thuyết**

Minimax là thuật toán tìm kiếm đối kháng (adversarial search) xuất phát từ lý thuyết trò chơi (game theory). Thuật toán mô phỏng một trò chơi hai người chơi: MAX player cố gắng TỐI THIỂU HÓA cost, trong khi MIN player cố gắng TỐI ĐẠI HÓA cost (worst-case scenario). Alpha-Beta Pruning là kỹ thuật cắt tỉa (pruning) để giảm số nhánh cần đánh giá mà không ảnh hưởng kết quả cuối cùng.

**Tham số**

depth_limit = 6  |  max_branching = 8  |  seed = 0

**Kết quả của thuật toán**

Trả về lịch học robust (tốt trong trường hợp xấu nhất) + convergence log mỗi lần đánh giá root. Minimax không phù hợp với bài toán xếp lịch vì không phải bài toán đối kháng thực sự, và độ phức tạp O(b^d) quá cao khi N lớn.

[CHÈN ẢNH: Sơ đồ cây trò chơi Minimax  MAX và MIN nodes xen kẽ]
[Ghi chú dưới ảnh: "Hình 1: Minh họa cây trò chơi Minimax với Alpha-Beta Pruning"]

**[CODE BLOCK  đặt trong khung nền xám, font Courier New 11pt]**


```python
# Import thư viện
from __future__ import annotations
import random
from typing import Any, Dict, List, Tuple
from .base import BaseScheduler
from .fitness import calculate_fitness

class MinimaxScheduler(BaseScheduler):
    '''Lớp triển khai Minimax + Alpha-Beta Pruning cho xếp lịch'''
    
    def __init__(
        self,
        subjects: List[str],
        time_slots: List[str],
        constraints: Dict[str, List[str]],
        *,
        priorities: Dict[str, int] | None = None,
        additional_constraints: Dict[str, Any] | None = None,
        subject_details: Dict[str, Any] | None = None,
        depth_limit: int = 6,        # Giới hạn độ sâu cây
        max_branching: int = 8,      # Giới hạn số nhánh mỗi node
        seed: int = 0,
    ):
        super().__init__(subjects, time_slots, constraints,
                         priorities=priorities,
                         additional_constraints=additional_constraints,
                         subject_details=subject_details)
        # Giới hạn depth để tránh explosion
        self.depth_limit = min(int(depth_limit), self.num_subjects)
        self.max_branching = max(1, int(max_branching))
        self._rng = random.Random(seed)
        
        # Sắp xếp slots: available slots trước
        available = list(self.additional_constraints.get("available_slots", []))
        available_set = set(available)
        ordered = available + [s for s in self.time_slots if s not in available_set]
        self._ordered_slot_indices = [
            self.time_slots.index(s) for s in ordered if s in self.time_slots
        ]

    def _candidate_slot_indices(self) -> List[int]:
        '''Lấy max_branching slots để giảm branching factor'''
        return self._ordered_slot_indices[: min(self.max_branching, len(self._ordered_slot_indices))]

    def _complete_assignment(self, assignment: List[int]) -> List[int]:
        '''Hoàn thiện các môn chưa gán (khi đạt depth limit)'''
        completed = assignment.copy()
        for i in range(self.num_subjects):
            if completed[i] == -1:  # Chưa được gán
                completed[i] = self._rng.randint(0, self.num_slots - 1)
        return completed

    def _fitness(self, individual: List[int]) -> float:
        '''Tính fitness (penalty)'''
        return calculate_fitness(
            subjects=self.subjects,
            time_slots=self.time_slots,
            constraints=self.constraints,
            individual=individual,
            priorities=self.priorities,
            additional_constraints=self.additional_constraints,
            subject_details=self.subject_details,
        )

    def minimax(
        self,
        depth: int,
        subject_index: int,
        assignment: List[int],
        alpha: float,
        beta: float,
        is_maximizing: bool,
    ) -> float:
        '''Thuật toán Minimax với Alpha-Beta Pruning'''
        # Terminal: đạt depth limit hoặc gán hết môn
        if depth >= self.depth_limit or subject_index >= self.num_subjects:
            completed = self._complete_assignment(assignment)
            return self._fitness(completed)
        
        candidates = self._candidate_slot_indices()
        
        if is_maximizing:
            # MAX player: tối thiểu hóa cost
            value = float("inf")
            for slot_idx in candidates:
                assignment[subject_index] = slot_idx
                value = min(
                    value,
                    self.minimax(depth + 1, subject_index + 1, assignment, alpha, beta, False),
                )
                beta = min(beta, value)
                if beta <= alpha:  # Alpha-Beta pruning
                    break
            assignment[subject_index] = -1
            return value
        else:
            # MIN player: tối đại hóa cost
            value = float("-inf")
            for slot_idx in candidates:
                assignment[subject_index] = slot_idx
                value = max(
                    value,
                    self.minimax(depth + 1, subject_index + 1, assignment, alpha, beta, True),
                )
                alpha = max(alpha, value)
                if beta <= alpha:  # Alpha-Beta pruning
                    break
            assignment[subject_index] = -1
            return value

    def _decode(self, best_individual: List[int]) -> List[dict]:
        '''Chuyển đổi thành lịch học'''
        return [
            {"subject": subject, "time": self.time_slots[best_individual[i]]}
            for i, subject in enumerate(self.subjects)
        ]

    def run(self) -> Tuple[List[dict], float, List[Dict[str, Any]]]:
        '''Chạy Minimax từ root'''
        # Root: MAX chọn slot cho môn 0
        assignment = [-1] * self.num_subjects
        best_slot = None
        best_value = float("inf")
        convergence_minimax = []
        evaluation_count = 0
        
        for slot_idx in self._candidate_slot_indices():
            assignment[0] = slot_idx
            value = self.minimax(
                1, 1, assignment,
                alpha=float("-inf"),
                beta=float("inf"),
                is_maximizing=False
            )
            evaluation_count += 1
            
            if value < best_value:
                best_value = value
                best_slot = slot_idx
            
            # Ghi convergence log
            convergence_minimax.append({
                "evaluation": evaluation_count,
                "cost": float(best_value)
            })
        
        assignment[0] = best_slot if best_slot is not None else 0
        completed = self._complete_assignment(assignment)
        cost = self._fitness(completed)
        
        return self._decode(completed), float(cost), convergence_minimax
```

---

### III. HÀM ĐÁNH GIÁ FITNESS

#### 3.1 Cơ chế hoạt động trong Minimax

Minimax gọi calculate_fitness() ở mỗi terminal node (khi đạt depth limit). Với depth=6 và branching=8, số lần gọi fitness  8^6 = 262,144 trong worst case. Alpha-Beta pruning giúp giảm xuống còn ~8^3 = 512 trong best case.

#### 3.2 Minimax gọi fitness như thế nào

```python
def _fitness(self, individual: List[int]) -> float:
    return calculate_fitness(
        subjects=self.subjects,
        time_slots=self.time_slots,
        constraints=self.constraints,
        individual=individual,
        priorities=self.priorities,
        additional_constraints=self.additional_constraints,
        subject_details=self.subject_details,
    )

# Số lần gọi fitness:
#   Worst case (không pruning): O(b^d) = O(8^6) = 262,144
#   Best case (pruning tốt): O(b^(d/2)) = O(8^3) = 512
#   Average case: O(b^(3d/4))  4,096
```

#### 3.3 Bảng penalty và cách Minimax xử lý

| Loại vi phạm | Loại | Penalty | Minimax phản ứng |
|---|---|---|---|
| Hai môn trùng slot | Cứng | +1000-1500 | MIN player chọn slot gây xung đột  MAX phải tránh |
| Môn xếp vào slot cấm | Cứng | +500 | MIN player ép MAX vào slot cấm  MAX tìm đường khác |
| Slot không khả dụng | Mềm | +800 | Ảnh hưởng đến minimax value |
| Các ràng buộc mềm khác | Mềm | 100-300 | Tích lũy vào tổng cost |

**Vấn đề:** Minimax giả định có adversary thực sự, nhưng xếp lịch không phải bài toán đối kháng  Minimax không phù hợp.

---

### IV. ĐÁNH GIÁ VÀ SO SÁNH

#### 4.1 Các chỉ số đánh giá

| Chỉ số | Đơn vị | Ý nghĩa |
|---|---|---|
| Cost | Điểm phạt | Penalty của lịch tốt nhất Minimax tìm được |
| Execution Time | milliseconds | Thời gian chạy - thường chậm do O(b^d) |
| Removed Count | Số môn | Số môn bị loại trước khi chạy |
| Convergence Log | List[dict] | {evaluation, cost} mỗi lần đánh giá root |

#### 4.2 Độ phức tạp

```
Độ phức tạp Minimax:
  - Worst case: O(b^d) = O(8^6) = 262,144
  - Best case (Alpha-Beta): O(b^(d/2)) = O(8^3) = 512
  - Average case: O(b^(3d/4))  4,096

So sánh:
  GA:      O(20,000)   - Nhanh nhờ early-stop
  HC:      O(5,000)    - Nhanh
  SA:      O(10,000)   - Trung bình
  Minimax: O(4,096-262,144) - Chậm nhất, phụ thuộc pruning
```

#### 4.3 So sánh với 3 thuật toán khác

| Tiêu chí | Minimax (của tôi) | GA | HC | SA |
|---|---|---|---|---|
| Loại thuật toán | Adversarial search | Population-based | Local search | Local search |
| Phù hợp bài toán | KHÔNG (không đối kháng) | Rất phù hợp | Phù hợp | Phù hợp |
| Tốc độ | Chậm nhất | Nhanh | Trung bình | Nhanh nhất |
| Chất lượng | Kém khi N>6 | Tốt nhất | Tốt | Rất tốt |
| Độ phức tạp | O(b^d) - explosion | O(20K) | O(5K) | O(10K) |
| Giới hạn | depth=6 (N6) | Không | Không | Không |

---

### V. XÂY DỰNG GIẢI PHÁP

#### 5.1 Luồng tích hợp

```
1. Frontend  POST /api/schedule
   Body: { subjects, constraints, priorities, algorithm: "minimax" }

2. main.py  Tiền xử lý

3. Khởi tạo MinimaxScheduler
   Tham số: depth_limit=6, max_branching=8

4. Minimax chạy  Duyệt cây trò chơi với Alpha-Beta
   - Root đánh giá max_branching slots cho môn 0
   - Mỗi nhánh gọi minimax() đệ quy
   - Ghi convergence_minimax mỗi lần đánh giá root

5. Kết quả  (schedule, cost, convergence_minimax)

6. Frontend  Hiển thị
```

---

### VI. HIỂN THỊ KẾT QUẢ

#### 6.1 Kết quả xếp lịch

[CHÈN ẢNH: Screenshot giao diện web - Minimax]
[Ghi chú: "Hình 2: Kết quả xếp lịch của Minimax"]

#### 6.2 Biểu đồ hội tụ

[CHÈN ẢNH: Biểu đồ hội tụ Minimax - ít điểm, giảm nhanh]
[Ghi chú: "Hình 3: Biểu đồ hội tụ Minimax - chỉ có max_branching điểm"]

#### 6.3 Kết quả Benchmark

Nhận xét:
 Minimax THẤT BẠI ở bộ 10 môn (cost = 1580)
 Minimax chỉ hoạt động tốt với N6
 GA, HC, SA đều đạt cost = 0
 Minimax chậm nhất (8-15ms)

[CHÈN ẢNH: Bảng benchmark - Minimax thua xa 3 thuật toán khác]
[Ghi chú: "Hình 4: Minimax không phù hợp với bài toán xếp lịch"]

---

### VII. KẾT LUẬN

#### 7.1 Kết quả

 Minimax thất bại với N>6 do giới hạn depth
 Cost cao (1580) so với GA/HC/SA (cost=0)
 Thời gian chạy chậm do O(b^d)
 Không phù hợp với bài toán xếp lịch

#### 7.2 Nhận xét

Minimax là thuật toán KHÔNG PHÙHỢP cho bài toán xếp lịch học vì:
1. Xếp lịch không phải bài toán đối kháng
2. Độ phức tạp O(b^d) quá cao
3. Phải giới hạn depth  nghiệm kém
4. GA/HC/SA cho kết quả tốt hơn nhiều

**Khuyến nghị:** Không nên dùng Minimax cho xếp lịch. Dùng GA hoặc SA thay thế.

---

## LƯU Ý KHI TẠO FILE

1. **Code blocks**: Font Courier New 11pt, nền xám #F2F2F2, có viền
2. **Chỗ chèn ảnh**: Placeholder viền nét đứt, nền #FAFAFA, cao 6-7cm
3. **Highlight**: TỐI THIỂU HÓA, TỐI ĐẠI HÓA, KHÔNG PHÙHỢP viết in đậm/in hoa
4. **Dòng phân công**: "[ Phụ trách: Hoàng ]" in nghiêng, màu #2E75B6
5. **Không tự thêm nội dung** ngoài những gì đã có

