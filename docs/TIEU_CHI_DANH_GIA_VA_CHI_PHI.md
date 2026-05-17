# Tiêu chí đánh giá và Chi phí (Cost) của các thuật toán

## 📊 Tổng quan

Dự án Smart Scheduler sử dụng **4 thuật toán tối ưu** để xếp lịch học:
1. **Genetic Algorithm (GA)** - Thuật toán di truyền
2. **Hill Climbing (HC)** - Leo đồi
3. **Simulated Annealing (SA)** - Luyện kim mô phỏng
4. **Minimax + Alpha-Beta Pruning** - Thuật toán đối kháng

Tất cả 4 thuật toán đều sử dụng **cùng một hàm đánh giá chi phí** (`calculate_fitness` trong `fitness.py`) để đảm bảo tính công bằng khi so sánh.

---

## 🎯 Tiêu chí đánh giá chung (Hàm Fitness)

### Mục tiêu: **Tối thiểu hóa chi phí (Cost/Penalty)**

Chi phí càng thấp = Thời khóa biểu càng tốt

### Các tiêu chí penalty:

#### 1. **Trùng slot (Slot Collision)** - Penalty: 1000-1500
- Hai môn học được xếp vào cùng một khung giờ
- **Logic ưu tiên:**
  - Môn có priority cao hơn: penalty = 1000
  - Môn có priority thấp hơn: penalty = 1500
- **Mục đích:** Tránh xung đột thời gian, ưu tiên môn quan trọng

#### 2. **Vi phạm slot cấm (Forbidden Slots)** - Penalty: 500 - (priority-5)*50
- Môn học bị xếp vào khung giờ mà sinh viên không thể học
- **Công thức:** `penalty = 500 - (priority - 5) * 50`
- **Ví dụ:**
  - Priority 10: penalty = 250
  - Priority 5: penalty = 500
  - Priority 1: penalty = 700
- **Mục đích:** Tránh xếp vào giờ không khả dụng, ưu tiên môn quan trọng

#### 3. **Môn liên tiếp cùng ngày (Consecutive Subjects)** - Penalty: 200
- Các môn học liên tiếp trong danh sách bị xếp vào cùng một ngày
- **Điều kiện:** `avoidConsecutive = true`
- **Mục đích:** Phân bổ đều môn học qua các ngày trong tuần

#### 4. **Cân bằng môn giữa các ngày (Balance Days)** - Penalty: 50 * chênh lệch
- Chênh lệch số môn học giữa ngày có nhiều môn nhất và ít môn nhất
- **Công thức:** `penalty = (max_subjects_per_day - min_subjects_per_day) * 50`
- **Điều kiện:** `balanceDays = true`
- **Mục đích:** Tránh ngày quá tải hoặc quá ít môn

#### 5. **Học buổi chiều (Afternoon Penalty)** - Penalty: 100
- Môn học bị xếp vào buổi chiều (12:30-17:00)
- **Điều kiện:** `preferMorning = true`
- **Mục đích:** Ưu tiên học buổi sáng

#### 6. **Học thứ 7 (Saturday Penalty)** - Penalty: 300
- Môn học bị xếp vào thứ 7
- **Điều kiện:** `allowSaturday = false`
- **Mục đích:** Tránh học cuối tuần

#### 7. **Slot không khả dụng (Unavailable Slots)** - Penalty: 800 - (priority-5)*50
- Môn học bị xếp vào slot không có trong danh sách available_slots
- **Công thức:** `penalty = 800 - (priority - 5) * 50`
- **Mục đích:** Ưu tiên xếp vào giờ rảnh của sinh viên

#### 8. **Ngày ưa thích (Preferred Days)** - Bonus: -150
- Môn học được xếp vào ngày mà sinh viên ưa thích
- **Điều kiện:** `preferred_days` được chỉ định
- **Mục đích:** Tăng sự hài lòng của sinh viên

#### 9. **Môn thường học tối (Regular Subject Evening)** - Penalty: +80
- Môn học thường (không phải học lại) bị xếp vào buổi tối (17:30-21:15)
- **Mục đích:** Ưu tiên môn thường học vào giờ hành chính

#### 10. **Môn học lại học sáng (Retake Subject Morning)** - Bonus: -20
- Môn học lại được xếp vào buổi sáng
- **Mục đích:** Khuyến khích môn học lại học vào giờ tốt

---

## 🔬 Đặc điểm của từng thuật toán

### 1. **Genetic Algorithm (GA)**
- **Cơ chế:** Tiến hóa quần thể qua các thế hệ
- **Tham số:**
  - Population size: 100
  - Generations: 200
  - Mutation rate: 10%
  - Elitism: 10%
- **Convergence data:** Ghi lại cost tốt nhất mỗi thế hệ
- **Ưu điểm:** Khám phá không gian tìm kiếm rộng, tránh local optimum
- **Nhược điểm:** Thời gian chạy lâu hơn

### 2. **Hill Climbing (HC)**
- **Cơ chế:** Leo đồi với random restarts
- **Tham số:**
  - Random restarts: 50
  - Max iterations: 5000
  - Strategy: Steepest-ascent (chọn neighbor tốt nhất)
- **Convergence data:** Ghi lại cost tốt nhất mỗi 100 iterations
- **Ưu điểm:** Đơn giản, nhanh
- **Nhược điểm:** Dễ bị kẹt ở local optimum

### 3. **Simulated Annealing (SA)**
- **Cơ chế:** Chấp nhận giải pháp xấu hơn với xác suất giảm dần
- **Tham số:**
  - Initial temperature: 1000.0
  - Cooling rate (alpha): 0.995
  - Min temperature: 0.01
  - Max iterations: 10000
- **Convergence data:** Ghi lại cost hiện tại mỗi 100 iterations
- **Ưu điểm:** Thoát khỏi local optimum, cân bằng exploration/exploitation
- **Nhược điểm:** Cần điều chỉnh tham số nhiệt độ

### 4. **Minimax + Alpha-Beta**
- **Cơ chế:** Mô phỏng trò chơi đối kháng (MAX vs MIN)
- **Tham số:**
  - Depth limit: min(6, num_subjects)
  - Max branching: 8
  - Pruning: Alpha-Beta
- **Convergence data:** Ghi lại cost tốt nhất mỗi lần đánh giá root
- **Ưu điểm:** Tìm giải pháp robust (chống worst-case)
- **Nhược điểm:** Chỉ phù hợp với bài toán nhỏ (≤6 môn)

---

## 📈 Biểu đồ và Visualization

### Biểu đồ hội tụ (Convergence Chart)
- **GA:** Trục X = Generation (Thế hệ), Trục Y = Cost
- **HC:** Trục X = Iteration (Vòng lặp), Trục Y = Cost
- **SA:** Trục X = Iteration (Vòng lặp), Trục Y = Cost
- **Minimax:** Trục X = Evaluation (Đánh giá), Trục Y = Cost

### So sánh tất cả thuật toán
Khi bấm "So sánh tất cả thuật toán", hệ thống hiển thị:

1. **Biểu đồ cột - Chi phí (Cost)**
   - So sánh cost cuối cùng của 4 thuật toán
   - Thuật toán tốt nhất được tô màu xanh lá

2. **Biểu đồ cột - Thời gian (Time)**
   - So sánh thời gian thực thi (ms)
   - Thuật toán tốt nhất được tô màu xanh lá

3. **Biểu đồ đường - Hội tụ**
   - Hiển thị quá trình tối ưu của cả 4 thuật toán trên cùng 1 biểu đồ
   - Mỗi thuật toán có màu riêng
   - Thuật toán tốt nhất có đường nét đậm hơn

4. **Bảng so sánh chi tiết**
   - Cost, Time, Số môn bị loại
   - Đánh dấu thuật toán tốt nhất

---

## 🎓 Ví dụ minh họa

### Ví dụ 1: Thời khóa biểu tốt (Cost = 0)
```
- Không có môn trùng slot
- Tất cả môn đều trong available_slots
- Không vi phạm ràng buộc nào
→ Cost = 0 (Hoàn hảo!)
```

### Ví dụ 2: Thời khóa biểu có xung đột (Cost = 1500)
```
- 2 môn trùng slot, môn priority thấp bị penalty
→ Cost = 1500
```

### Ví dụ 3: Thời khóa biểu phức tạp (Cost = 2350)
```
- 1 môn trùng slot (priority thấp): +1500
- 1 môn vi phạm forbidden slot (priority 5): +500
- 2 môn liên tiếp cùng ngày: +200
- 1 môn học buổi chiều (preferMorning=true): +100
- 1 môn có preferred_day: -150
→ Total Cost = 2350
```

---

## 🔍 Cách đọc kết quả

### Cost = 0
✅ **Hoàn hảo!** Thời khóa biểu không vi phạm bất kỳ ràng buộc nào.

### Cost < 500
✅ **Rất tốt!** Có một số vi phạm nhỏ (ví dụ: học buổi chiều, không cân bằng hoàn toàn).

### Cost 500-1500
⚠️ **Chấp nhận được.** Có một số xung đột hoặc vi phạm ràng buộc.

### Cost > 1500
❌ **Cần cải thiện.** Có nhiều xung đột hoặc vi phạm nghiêm trọng.

---

## 📚 Tài liệu tham khảo

- **Source code:** `smart-scheduler-api/genetic_algorithm/fitness.py`
- **Thuật toán GA:** `smart-scheduler-api/genetic_algorithm/scheduler_ga.py`
- **Thuật toán HC:** `smart-scheduler-api/genetic_algorithm/hill_climbing.py`
- **Thuật toán SA:** `smart-scheduler-api/genetic_algorithm/simulated_annealing.py`
- **Thuật toán Minimax:** `smart-scheduler-api/genetic_algorithm/minimax_scheduler.py`
- **API endpoint:** `smart-scheduler-api/main.py` - `/api/schedule/compare`

---

## 🚀 Cách sử dụng

1. **Chạy một thuật toán:**
   - Chọn thuật toán từ dropdown
   - Bấm "Tạo thời khóa biểu"
   - Xem biểu đồ hội tụ riêng

2. **So sánh tất cả thuật toán:**
   - Bấm "So sánh tất cả thuật toán"
   - Xem biểu đồ so sánh chi phí, thời gian, và hội tụ
   - Xem bảng chi tiết

3. **Benchmark:**
   - Bấm "Xem Benchmark"
   - Xem kết quả trên 5 bộ dữ liệu mẫu cố định

---

**Cập nhật:** 2026-05-15
**Phiên bản:** 1.0.0
