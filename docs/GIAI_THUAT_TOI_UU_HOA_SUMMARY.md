# TÓM TẮT: CÁC THUẬT TOÁN TỐI ƯU HÓA XẾP LỊCH HỌC

## Tổng quan

Hệ thống Smart Scheduler sử dụng 4 thuật toán tối ưu hóa để giải quyết bài toán xếp lịch học (NP-hard):

1. **Genetic Algorithm (GA)** - Thuật toán Di truyền
2. **Hill Climbing (HC)** - Thuật toán Leo đồi
3. **Simulated Annealing (SA)** - Thuật toán Luyện kim mô phỏng
4. **Minimax + Alpha-Beta Pruning** - Thuật toán Minimax với cắt tỉa Alpha-Beta

## Bảng so sánh nhanh

| Thuật toán | Tốc độ | Chất lượng | Bộ nhớ | Độ phức tạp | Khuyến nghị |
|------------|--------|------------|--------|-------------|-------------|
| **GA** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | Cao | ✅ Mặc định |
| **Hill Climbing** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Thấp | ✅ Nếu cần nhanh |
| **SA** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Trung bình | ✅ Cân bằng |
| **Minimax** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Rất cao | ❌ Không khuyến nghị |

## 1. Genetic Algorithm (GA)

### Ý tưởng
Mô phỏng quá trình tiến hóa tự nhiên: chọn lọc, lai ghép, đột biến.

### Tham số chính
- Population size: 100 cá thể
- Generations: 200 thế hệ
- Mutation rate: 10%
- Elitism: 10%
- Selection: Tournament (k=5)
- Crossover: Single-point

### Ưu điểm
- ✅ Chất lượng nghiệm tốt nhất
- ✅ Khám phá song song nhiều vùng
- ✅ Không dễ bị kẹt local optimum

### Nhược điểm
- ❌ Chậm nhất (~200,000 lần gọi fitness)
- ❌ Tốn nhiều bộ nhớ (100 cá thể)
- ❌ Nhiều tham số cần điều chỉnh

### Khi nào dùng
- Khi chất lượng nghiệm quan trọng hơn thời gian
- Khi có đủ tài nguyên tính toán
- Khi bài toán phức tạp, nhiều local optimum

## 2. Hill Climbing (HC)

### Ý tưởng
Bắt đầu từ nghiệm ngẫu nhiên, liên tục di chuyển đến nghiệm láng giềng tốt hơn.

### Tham số chính
- Random restarts: 50 lần
- Max iterations: 5,000
- Neighbor: Thay đổi 1 gen
- Strategy: Steepest-ascent

### Ưu điểm
- ✅ Nhanh nhất (~5,000 lần gọi fitness)
- ✅ Đơn giản, dễ implement
- ✅ Tiết kiệm bộ nhớ

### Nhược điểm
- ❌ Dễ bị kẹt local optimum
- ❌ Phụ thuộc điểm khởi đầu
- ❌ Cần nhiều random restarts

### Khi nào dùng
- Khi cần nghiệm nhanh
- Khi tài nguyên hạn chế
- Khi cần nghiệm "đủ tốt"

## 3. Simulated Annealing (SA)

### Ý tưởng
Mô phỏng quá trình luyện kim: chấp nhận nghiệm tệ hơn với xác suất giảm dần.

### Tham số chính
- Initial temperature: 1000
- Cooling rate (alpha): 0.995
- Min temperature: 0.01
- Max iterations: 10,000
- Acceptance: p = exp(-Δcost / T)

### Ưu điểm
- ✅ Cân bằng tốc độ và chất lượng
- ✅ Có thể thoát local optimum
- ✅ Đơn giản hơn GA

### Nhược điểm
- ❌ Chậm hơn Hill Climbing
- ❌ Cần điều chỉnh tham số (T, alpha)
- ❌ Hội tụ không ổn định

### Khi nào dùng
- Khi cần cân bằng tốc độ và chất lượng
- Khi bài toán có nhiều local optimum
- Khi muốn tránh kẹt local optimum

## 4. Minimax + Alpha-Beta

### Ý tưởng
Mô phỏng trò chơi đối kháng: MAX tối thiểu hóa, MIN tối đại hóa cost.

### Tham số chính
- Depth limit: 6
- Max branching: 8
- Pruning: Alpha-Beta
- Strategy: Adversarial search

### Ưu điểm
- ✅ Nghiệm robust (tốt trong worst-case)
- ✅ Có cơ sở lý thuyết vững
- ✅ Alpha-Beta giảm số nhánh

### Nhược điểm
- ❌ Không phù hợp với xếp lịch
- ❌ Độ phức tạp cực kỳ cao
- ❌ Cần giới hạn depth

### Khi nào dùng
- Khi cần nghiệm robust
- Khi bài toán có tính đối kháng
- **Không khuyến nghị cho xếp lịch**

## Hàm Fitness (Shared)

Tất cả 4 thuật toán sử dụng CÙNG MỘT hàm fitness:

```python
def calculate_fitness(
    subjects, time_slots, constraints, individual,
    priorities, additional_constraints, subject_details
) -> float
```

### Các ràng buộc (Penalty)

| Ràng buộc | Loại | Penalty | Mô tả |
|-----------|------|---------|-------|
| Xung đột khung giờ | Hard | 1000-1500 | 2 môn cùng slot |
| Khung giờ bị cấm | Hard | 250-700 | Môn vào slot cấm |
| Môn liên tiếp cùng ngày | Soft | 200 | 2 môn liên tiếp cùng ngày |
| Cân bằng ngày | Soft | 50×chênh lệch | Chênh lệch số môn/ngày |
| Ưu tiên buổi sáng | Soft | 100 | Môn buổi chiều |
| Không học thứ 7 | Soft | 300 | Môn thứ 7 |
| Slot không khả dụng | Soft | 300-800 | Slot không available |
| Ngày ưa thích | Bonus | -150 | Môn vào ngày yêu thích |

## Convergence Log

Mỗi thuật toán ghi lại quá trình hội tụ:

- **GA**: `{"generation": int, "cost": float}` - Mỗi thế hệ
- **Hill Climbing**: `{"iteration": int, "cost": float}` - Mỗi 100 iterations
- **SA**: `{"iteration": int, "cost": float}` - Mỗi 100 iterations
- **Minimax**: `{"evaluation": int, "cost": float}` - Mỗi lần đánh giá root

## Kết quả thực nghiệm (ví dụ)

Với 10 môn học, 21 khung giờ:

| Thuật toán | Thời gian | Cost | Số lần gọi fitness |
|------------|-----------|------|-------------------|
| GA | 12.5s | **120** ⭐ | 200,000 |
| Hill Climbing | **0.8s** ⭐ | 300 | 5,000 |
| SA | 1.5s | 180 | 10,000 |
| Minimax | 8.2s | 250 | 50,000 |

## Khuyến nghị sử dụng

### Cho người dùng cuối
1. **Mặc định**: Genetic Algorithm (chất lượng tốt nhất)
2. **Nếu cần nhanh**: Hill Climbing
3. **Cân bằng**: Simulated Annealing

### Cho nhà nghiên cứu
- So sánh cả 4 để hiểu trade-off
- Điều chỉnh tham số cho bài toán cụ thể
- Thử hybrid approach: GA + Hill Climbing

## Tài liệu chi tiết

Xem file `GIAI_THUAT_TOI_UU_HOA_CHI_TIET_FULL.md` để biết:
- Giải thích chi tiết từng thuật toán
- Code implementation đầy đủ
- Ví dụ minh họa cụ thể
- Phân tích độ phức tạp
- So sánh và đánh giá

## Liên hệ

Smart Scheduler Team  
Ngày: 20/05/2026
