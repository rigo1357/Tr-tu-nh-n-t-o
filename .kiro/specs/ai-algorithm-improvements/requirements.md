# Requirements Document

## Introduction

Feature này cải tiến toàn diện phần thuật toán AI của hệ thống Smart Scheduler — hệ thống xếp thời khóa biểu tự động cho sinh viên đại học. Phạm vi bao gồm: nâng cấp Genetic Algorithm (GA) với crossover đa dạng hơn, adaptive mutation và constraint repair; cải tiến Simulated Annealing (SA) với adaptive cooling và swap neighbor; bổ sung hai thuật toán mới (Tabu Search và Hybrid GA+SA); thêm bước tiền xử lý Constraint Propagation (AC-3); và cải tiến hàm fitness với các ràng buộc mới cùng cơ chế cấu hình penalty linh hoạt qua `PenaltyConfig`.

Toàn bộ thay đổi phải tương thích ngược với API hiện tại (`ScheduleInput`, `_run_scheduler_algorithm`), kế thừa `BaseScheduler`, và sử dụng `calculate_fitness()` trong `genetic_algorithm/fitness.py` làm single source of truth cho logic penalty.

---

## Glossary

- **Scheduler**: Hệ thống Smart Scheduler API (Python/FastAPI).
- **GA_Engine**: Module Genetic Algorithm trong `genetic_algorithm/scheduler_ga.py`.
- **SA_Engine**: Module Simulated Annealing trong `genetic_algorithm/simulated_annealing.py`.
- **Tabu_Engine**: Module Tabu Search mới trong `genetic_algorithm/tabu_search.py`.
- **Hybrid_Engine**: Module Hybrid GA+SA mới trong `genetic_algorithm/hybrid_ga_sa.py`.
- **AC3_Preprocessor**: Module Constraint Propagation (AC-3) mới trong `genetic_algorithm/ac3.py`.
- **Fitness_Function**: Hàm `calculate_fitness()` trong `genetic_algorithm/fitness.py` — single source of truth cho toàn bộ logic penalty.
- **BaseScheduler**: Lớp cơ sở trong `genetic_algorithm/base.py` mà tất cả thuật toán phải kế thừa.
- **Dispatcher**: Hàm `_run_scheduler_algorithm()` trong `main.py` — định tuyến request đến đúng thuật toán.
- **Individual**: Một lời giải (chromosome) được mã hóa dưới dạng `list[int]`, trong đó `individual[i]` là chỉ số slot cho `subjects[i]`.
- **PenaltyConfig**: Schema cấu hình các hệ số penalty, được truyền qua API và dùng bởi `Fitness_Function`.
- **Tabu_List**: Danh sách các trạng thái (hoặc moves) bị cấm trong Tabu Search, có kích thước giới hạn bởi `tenure`.
- **Tenure**: Số bước mà một trạng thái bị giữ trong `Tabu_List` trước khi được giải phóng.
- **Slot**: Một khung giờ học, ví dụ `"T2_Sáng"`, `"T3_Chiều"`.
- **Domain**: Tập hợp các slot hợp lệ còn lại cho một môn học sau khi AC-3 loại bỏ các slot vi phạm ràng buộc.
- **Stagnation_Counter**: Bộ đếm số thế hệ liên tiếp mà GA không cải thiện được điểm tốt nhất.
- **Acceptance_Rate**: Tỷ lệ các bước SA chấp nhận nghiệm tệ hơn trong một cửa sổ quan sát gần đây.

---

## Requirements

### Requirement 1: GA — Order Crossover (OX) và Uniform Crossover

**User Story:** Là một kỹ sư AI, tôi muốn GA sử dụng các phép lai ghép đa dạng hơn, để quần thể có độ đa dạng cao hơn và thoát khỏi local optimum tốt hơn.

#### Acceptance Criteria

1. THE `GA_Engine` SHALL hỗ trợ ba chiến lược crossover: `single_point` (hiện tại), `order_crossover` (OX), và `uniform_crossover`, được chọn qua tham số `crossover_strategy` với giá trị mặc định là `"order_crossover"`.
2. WHEN `crossover_strategy` là `"order_crossover"`, THE `GA_Engine` SHALL tạo ra child chromosome bằng cách giữ nguyên một đoạn con từ parent1 và điền các gene còn lại theo thứ tự xuất hiện trong parent2.
3. WHEN `crossover_strategy` là `"uniform_crossover"`, THE `GA_Engine` SHALL tạo ra child chromosome bằng cách chọn ngẫu nhiên mỗi gene từ parent1 hoặc parent2 với xác suất 0.5.
4. THE `GA_Engine` SHALL đảm bảo child chromosome sau crossover có độ dài bằng độ dài của parent chromosome.
5. FOR ALL cặp parent chromosomes hợp lệ, `order_crossover(parent1, parent2)` SHALL tạo ra child chứa đúng tất cả các chỉ số slot từ 0 đến `num_slots - 1` (không có chỉ số ngoài phạm vi).
6. IF `crossover_strategy` nhận giá trị không hợp lệ, THEN THE `GA_Engine` SHALL raise `ValueError` với thông báo mô tả các giá trị hợp lệ.

---

### Requirement 2: GA — Adaptive Mutation Rate

**User Story:** Là một kỹ sư AI, tôi muốn tỷ lệ đột biến tự động tăng khi GA bị kẹt tại local optimum, để thuật toán có thể thoát ra và tiếp tục tìm kiếm.

#### Acceptance Criteria

1. THE `GA_Engine` SHALL theo dõi `Stagnation_Counter` — số thế hệ liên tiếp mà điểm tốt nhất không cải thiện.
2. WHEN `Stagnation_Counter` vượt ngưỡng `stagnation_threshold` (mặc định: 20 thế hệ), THE `GA_Engine` SHALL tăng mutation rate thêm `mutation_step` (mặc định: 0.05) cho đến tối đa `max_mutation_rate` (mặc định: 0.5).
3. WHEN điểm tốt nhất được cải thiện, THE `GA_Engine` SHALL đặt lại `Stagnation_Counter` về 0 và giảm mutation rate về `base_mutation_rate` (mặc định: 0.1).
4. THE `GA_Engine` SHALL đảm bảo mutation rate luôn nằm trong khoảng `[base_mutation_rate, max_mutation_rate]` tại mọi thế hệ.
5. FOR ALL giá trị `Stagnation_Counter` từ 0 đến `stagnation_threshold * 5`, mutation rate SHALL là hàm không giảm (non-decreasing) theo `Stagnation_Counter`.

---

### Requirement 3: GA — Constraint Repair sau Mutation

**User Story:** Là một kỹ sư AI, tôi muốn GA tự động sửa các xung đột slot sau đột biến thay vì chỉ phạt penalty, để chất lượng nghiệm được cải thiện nhanh hơn.

#### Acceptance Criteria

1. THE `GA_Engine` SHALL áp dụng bước `constraint_repair` sau mỗi lần mutation trước khi đưa individual vào quần thể mới.
2. WHEN hai môn học trong một individual được gán cùng một slot index, THE `GA_Engine` SHALL dịch chuyển môn thứ hai (theo thứ tự gặp trong individual) sang slot hợp lệ gần nhất (slot index nhỏ hơn hoặc lớn hơn) không bị xung đột; WHEN hai môn có priority bằng nhau, THE `GA_Engine` SHALL dịch chuyển môn thứ hai theo thứ tự gặp.
3. WHEN không tìm được slot hợp lệ nào để dịch chuyển, THE `GA_Engine` SHALL đảm bảo toàn bộ individual giữ nguyên trạng thái giống hệt trước khi repair (không thay đổi bất kỳ gene nào) và để `Fitness_Function` xử lý penalty.
4. THE `GA_Engine` SHALL đảm bảo sau `constraint_repair`, individual không chứa chỉ số slot ngoài phạm vi `[0, num_slots - 1]`.
5. FOR ALL individual không có xung đột slot, `constraint_repair(individual)` SHALL trả về individual không thay đổi (idempotence).
6. FOR ALL individual có xung đột slot, `constraint_repair(individual)` SHALL trả về individual có số lượng xung đột slot nhỏ hơn hoặc bằng individual đầu vào.

---

### Requirement 4: GA — Early Stopping thông minh

**User Story:** Là một kỹ sư AI, tôi muốn GA dừng sớm khi không còn cải thiện, để tiết kiệm thời gian tính toán mà không cần chạy hết 200 thế hệ.

#### Acceptance Criteria

1. THE `GA_Engine` SHALL hỗ trợ tham số `early_stopping_patience` (mặc định: 30 thế hệ) — số thế hệ liên tiếp không cải thiện trước khi dừng.
2. WHEN `Stagnation_Counter` đạt `early_stopping_patience`, THE `GA_Engine` SHALL dừng vòng lặp tiến hóa và trả về nghiệm tốt nhất đã tìm được.
3. THE `GA_Engine` SHALL luôn chạy ít nhất `min(early_stopping_patience, GENERATIONS)` thế hệ trước khi kiểm tra điều kiện dừng sớm, và SHALL được phép dừng ngay tại thế hệ đó nếu điều kiện early stopping đã thỏa mãn.
4. WHEN early stopping được kích hoạt, THE `GA_Engine` SHALL ghi nhận thế hệ dừng vào convergence log với trường `"stopped_early": true`.
5. IF `early_stopping_patience` được đặt bằng 0 hoặc giá trị âm, THEN THE `GA_Engine` SHALL vô hiệu hóa early stopping và chạy đủ `GENERATIONS` thế hệ.

---

### Requirement 5: SA — Adaptive Cooling Schedule

**User Story:** Là một kỹ sư AI, tôi muốn SA điều chỉnh tốc độ làm lạnh dựa trên tỷ lệ chấp nhận thực tế, để cân bằng giữa exploration và exploitation tốt hơn.

#### Acceptance Criteria

1. THE `SA_Engine` SHALL hỗ trợ tham số `cooling_strategy` với hai giá trị: `"geometric"` (hiện tại: `T = T * alpha`) và `"adaptive"` (mặc định mới).
2. WHEN `cooling_strategy` là `"adaptive"`, THE `SA_Engine` SHALL tính `Acceptance_Rate` trong cửa sổ `acceptance_window` bước gần nhất (mặc định: 100 bước).
3. WHEN `Acceptance_Rate` vượt ngưỡng `target_acceptance_rate` (mặc định: 0.4), THE `SA_Engine` SHALL giảm nhiệt độ nhanh hơn bằng cách nhân `T` với `alpha_fast` (mặc định: 0.99).
4. WHEN `Acceptance_Rate` thấp hơn `target_acceptance_rate`, THE `SA_Engine` SHALL giảm nhiệt độ chậm hơn bằng cách nhân `T` với `alpha_slow` (mặc định: 0.999).
5. THE `SA_Engine` SHALL đảm bảo nhiệt độ `T` luôn dương và không bao giờ tăng trong quá trình chạy (monotonically non-increasing).
6. FOR ALL cấu hình `alpha_fast` và `alpha_slow` hợp lệ (0 < alpha_fast <= alpha_slow < 1), nhiệt độ SHALL giảm đơn điệu qua các bước.

---

### Requirement 6: SA — Swap Neighbor Generation

**User Story:** Là một kỹ sư AI, tôi muốn SA có thêm kiểu tạo neighbor bằng cách hoán đổi slot của hai môn, để khám phá không gian tìm kiếm đa dạng hơn.

#### Acceptance Criteria

1. THE `SA_Engine` SHALL hỗ trợ tham số `neighbor_strategy` với hai giá trị: `"single_gene"` (hiện tại) và `"swap"`, và `"mixed"` (chọn ngẫu nhiên giữa hai kiểu với xác suất bằng nhau).
2. WHEN `neighbor_strategy` là `"swap"`, THE `SA_Engine` SHALL tạo neighbor bằng cách chọn ngẫu nhiên hai chỉ số môn học `i ≠ j` và hoán đổi `individual[i]` với `individual[j]`.
3. THE `SA_Engine` SHALL đảm bảo swap neighbor có độ dài bằng solution gốc và chứa đúng các slot index hợp lệ.
4. FOR ALL solution `s` và cặp chỉ số `(i, j)`, `swap(swap(s, i, j), i, j)` SHALL bằng `s` (tính đối xứng của swap).
5. WHEN `neighbor_strategy` là `"mixed"`, THE `SA_Engine` SHALL chọn ngẫu nhiên `"single_gene"` hoặc `"swap"` với xác suất 0.5 tại mỗi bước.

---

### Requirement 7: Thuật toán mới — Tabu Search

**User Story:** Là một kỹ sư AI, tôi muốn có thuật toán Tabu Search để tránh quay lại các trạng thái đã thăm và thoát khỏi local optimum hiệu quả hơn Hill Climbing.

#### Acceptance Criteria

1. THE `Tabu_Engine` SHALL kế thừa `BaseScheduler` và implement phương thức `run()` trả về `(schedule: List[dict], cost: float)`.
2. THE `Tabu_Engine` SHALL duy trì `Tabu_List` với kích thước tối đa `tenure` (mặc định: 10) — khi danh sách đầy, phần tử cũ nhất bị loại bỏ (FIFO).
3. WHEN tạo neighbor, THE `Tabu_Engine` SHALL đánh giá tất cả các single-gene moves và chọn move tốt nhất không có trong `Tabu_List`.
4. WHEN tất cả moves đều nằm trong `Tabu_List` và không có aspiration criterion nào thỏa mãn, THE `Tabu_Engine` SHALL chọn move có cost thấp nhất trong số các tabu moves, kể cả khi move đó làm xấu nghiệm hiện tại.
5. THE `Tabu_Engine` SHALL thêm move vừa thực hiện vào `Tabu_List` sau mỗi bước.
6. THE `Tabu_Engine` SHALL đảm bảo kích thước `Tabu_List` không vượt quá `tenure` tại bất kỳ thời điểm nào.
7. THE `Tabu_Engine` SHALL gọi `Fitness_Function` (`calculate_fitness()`) để đánh giá cost — không được tự implement lại logic penalty.
8. THE `Dispatcher` SHALL nhận giá trị `algorithm = "tabu"` và định tuyến đến `Tabu_Engine`.
9. FOR ALL `tenure` từ 1 đến 50, kích thước `Tabu_List` SHALL không bao giờ vượt quá `tenure` sau bất kỳ số bước nào.

---

### Requirement 8: Tiền xử lý — Constraint Propagation (AC-3)

**User Story:** Là một kỹ sư AI, tôi muốn có bước tiền xử lý AC-3 để loại bỏ các slot không hợp lệ trước khi chạy thuật toán, giúp giảm không gian tìm kiếm cho tất cả các thuật toán.

#### Acceptance Criteria

1. THE `AC3_Preprocessor` SHALL nhận đầu vào là danh sách `subjects`, `time_slots`, và `constraints` (slot bị cấm theo môn), và trả về `reduced_domains: Dict[str, List[int]]` — ánh xạ từ tên môn sang danh sách chỉ số slot còn hợp lệ.
2. WHEN một slot bị liệt kê trong `constraints[subject]`, THE `AC3_Preprocessor` SHALL loại bỏ slot đó khỏi domain của môn học tương ứng.
3. THE `AC3_Preprocessor` SHALL đảm bảo mọi slot trong `reduced_domains[subject]` đều không vi phạm ràng buộc cứng (hard constraints) của môn đó.
4. IF domain của một môn học trở thành rỗng sau AC-3, THEN THE `AC3_Preprocessor` SHALL trả về domain đầy đủ cho môn đó (fallback) và ghi log cảnh báo.
5. THE `Scheduler` SHALL chạy `AC3_Preprocessor` trước khi khởi tạo bất kỳ thuật toán tối ưu nào khi `use_ac3 = True` (mặc định: `True`).
6. FOR ALL `individual` hợp lệ theo `reduced_domains`, `individual` SHALL cũng hợp lệ theo `constraints` gốc (soundness: AC-3 không loại bỏ nghiệm hợp lệ).
7. FOR ALL `constraints` đầu vào, `len(reduced_domains[s]) <= len(time_slots)` SHALL đúng với mọi môn `s` (AC-3 không tăng domain).

---

### Requirement 9: Thuật toán mới — Hybrid GA+SA

**User Story:** Là một kỹ sư AI, tôi muốn kết hợp GA (global search) với SA (local search) để tận dụng ưu điểm của cả hai, cho ra nghiệm tốt hơn so với chạy riêng lẻ.

#### Acceptance Criteria

1. THE `Hybrid_Engine` SHALL kế thừa `BaseScheduler` và implement phương thức `run()` trả về `(schedule: List[dict], cost: float, convergence: List[dict])`.
2. THE `Hybrid_Engine` SHALL chạy GA trong `ga_generations` thế hệ (mặc định: 100), sau đó áp dụng SA local search trên `top_k` cá thể tốt nhất (mặc định: 5) sau mỗi `sa_interval` thế hệ GA (mặc định: 20).
3. THE `Hybrid_Engine` SHALL sử dụng `GA_Engine` và `SA_Engine` hiện có (sau khi cải tiến) thay vì tự implement lại logic GA hoặc SA.
4. THE `Hybrid_Engine` SHALL gọi `Fitness_Function` (`calculate_fitness()`) để đánh giá cost — không được tự implement lại logic penalty.
5. THE `Dispatcher` SHALL nhận giá trị `algorithm = "hybrid"` và định tuyến đến `Hybrid_Engine`.
6. THE `Hybrid_Engine` SHALL trả về convergence log ghi nhận cost tốt nhất sau mỗi thế hệ GA và sau mỗi lần SA local search.
7. FOR ALL inputs, cost của nghiệm trả về bởi `Hybrid_Engine` SHALL nhỏ hơn hoặc bằng cost của nghiệm trả về bởi `GA_Engine` chạy với cùng số thế hệ trên cùng input (SA local search không được làm xấu nghiệm GA).

---

### Requirement 10: Fitness — Ràng buộc không học 3 buổi liên tiếp trong ngày

**User Story:** Là một sinh viên, tôi muốn thời khóa biểu không xếp 3 buổi học liên tiếp trong cùng một ngày, để tránh quá tải và có thời gian nghỉ ngơi.

#### Acceptance Criteria

1. THE `Fitness_Function` SHALL tính penalty cho ràng buộc `avoidTripleConsecutive` khi `additional_constraints["avoidTripleConsecutive"]` là `True`.
2. WHEN 3 hoặc nhiều hơn môn học được xếp vào các slot liên tiếp trong cùng một ngày (ví dụ: Sáng, Chiều, Tối của cùng ngày), THE `Fitness_Function` SHALL cộng thêm penalty `penalty_config.triple_consecutive_penalty` (mặc định: 300) cho mỗi nhóm 3 buổi liên tiếp.
3. THE `Fitness_Function` SHALL xác định "liên tiếp trong ngày" dựa trên thứ tự slot trong cùng ngày theo định dạng `"{day}_{period}"` (ví dụ: `T2_Sáng` < `T2_Chiều` < `T2_Tối`).
4. FOR ALL individual không có 3 buổi liên tiếp trong cùng ngày, penalty từ `avoidTripleConsecutive` SHALL bằng 0.
5. FOR ALL individual có đúng 3 buổi liên tiếp trong một ngày, penalty từ `avoidTripleConsecutive` SHALL lớn hơn 0.

---

### Requirement 11: Fitness — Soft constraint về giảng viên

**User Story:** Là một sinh viên, tôi muốn hệ thống phát hiện và phạt khi hai môn cùng giảng viên bị xếp trùng giờ, để tránh xung đột lịch giảng dạy.

#### Acceptance Criteria

1. THE `Fitness_Function` SHALL kiểm tra ràng buộc giảng viên khi `subject_details[subject]["instructor"]` được cung cấp.
2. WHEN hai môn học có cùng giá trị `instructor` được xếp vào cùng một slot index, THE `Fitness_Function` SHALL cộng thêm penalty `penalty_config.instructor_conflict_penalty` (mặc định: 800) cho mỗi cặp xung đột.
3. THE `Fitness_Function` SHALL xử lý trường hợp `instructor` là `None` hoặc chuỗi rỗng bằng cách bỏ qua ràng buộc này cho môn đó (không gây lỗi).
4. FOR ALL individual không có hai môn cùng giảng viên trùng slot, penalty từ instructor constraint SHALL bằng 0.
5. FOR ALL individual có ít nhất một cặp môn cùng giảng viên trùng slot, penalty từ instructor constraint SHALL lớn hơn 0.

---

### Requirement 12: Fitness — PenaltyConfig cấu hình được qua API

**User Story:** Là một quản trị viên hệ thống, tôi muốn cấu hình các hệ số penalty qua API thay vì hardcode magic numbers, để dễ dàng điều chỉnh hành vi xếp lịch mà không cần sửa code.

#### Acceptance Criteria

1. THE `Scheduler` SHALL định nghĩa schema `PenaltyConfig` trong `schemas.py` với các trường: `slot_collision_high` (mặc định: 1000), `slot_collision_low` (mặc định: 1500), `forbidden_slot_base` (mặc định: 500), `unavailable_slot_base` (mặc định: 800), `consecutive_day_penalty` (mặc định: 200), `day_imbalance_factor` (mặc định: 50), `afternoon_penalty` (mặc định: 100), `saturday_penalty` (mặc định: 300), `triple_consecutive_penalty` (mặc định: 300), `instructor_conflict_penalty` (mặc định: 800).
2. THE `ScheduleInput` SHALL chứa trường tùy chọn `penalty_config: Optional[PenaltyConfig] = None` — khi `None`, `Fitness_Function` sử dụng giá trị mặc định.
3. THE `Fitness_Function` SHALL nhận tham số `penalty_config: PenaltyConfig | None` và sử dụng các giá trị từ config thay cho magic numbers hiện tại.
4. FOR ALL `individual` và `penalty_config` mặc định, `calculate_fitness(individual, penalty_config=None)` SHALL trả về kết quả bằng `calculate_fitness(individual, penalty_config=PenaltyConfig())` (backward compatibility).
5. FOR ALL `individual` và hệ số `k > 0`, nếu tất cả các trường trong `PenaltyConfig` được nhân với `k`, tổng penalty SHALL được nhân với `k` (tính tuyến tính của penalty scaling).
6. IF bất kỳ trường nào trong `PenaltyConfig` nhận giá trị âm, THEN THE `Scheduler` SHALL trả về HTTP 422 với thông báo lỗi mô tả trường không hợp lệ.

---

### Requirement 13: Dispatcher — Đăng ký thuật toán mới

**User Story:** Là một developer, tôi muốn các thuật toán mới (Tabu Search, Hybrid GA+SA) được tích hợp vào dispatcher hiện có, để client có thể gọi qua cùng API endpoint mà không cần thay đổi giao diện.

#### Acceptance Criteria

1. THE `Dispatcher` SHALL nhận và xử lý các giá trị `algorithm`: `"ga"`, `"hill_climbing"`, `"sa"`, `"minimax"`, `"tabu"`, `"hybrid"`.
2. WHEN `algorithm = "tabu"`, THE `Dispatcher` SHALL khởi tạo và chạy `Tabu_Engine` với các tham số từ `ScheduleInput`.
3. WHEN `algorithm = "hybrid"`, THE `Dispatcher` SHALL khởi tạo và chạy `Hybrid_Engine` với các tham số từ `ScheduleInput`.
4. IF `algorithm` nhận giá trị không thuộc danh sách hợp lệ, THEN THE `Dispatcher` SHALL trả về HTTP 400 với thông báo liệt kê các giá trị hợp lệ.
5. THE `Dispatcher` SHALL truyền `penalty_config` từ `ScheduleInput` xuống tất cả các thuật toán khi được cung cấp.
6. THE `Dispatcher` SHALL truyền `reduced_domains` từ `AC3_Preprocessor` xuống tất cả các thuật toán khi `use_ac3 = True`.

---

### Requirement 14: Tích hợp AC-3 với tất cả thuật toán

**User Story:** Là một kỹ sư AI, tôi muốn AC-3 được chạy tự động trước tất cả các thuật toán, để mọi thuật toán đều được hưởng lợi từ không gian tìm kiếm đã được thu hẹp.

#### Acceptance Criteria

1. THE `BaseScheduler` SHALL nhận tham số tùy chọn `reduced_domains: Dict[str, List[int]] | None = None` trong constructor.
2. WHEN `reduced_domains` được cung cấp, THE `BaseScheduler` SHALL sử dụng `reduced_domains[subject]` thay vì toàn bộ `time_slots` khi tạo random solution và tạo neighbor.
3. THE `Scheduler` SHALL chạy `AC3_Preprocessor` trong `_run_scheduler_algorithm()` trước khi khởi tạo bất kỳ thuật toán nào khi `use_ac3 = True`.
4. WHEN `reduced_domains[subject]` rỗng (do AC-3 fallback), THE `BaseScheduler` SHALL sử dụng toàn bộ `time_slots` cho môn đó.
5. THE `ScheduleInput` SHALL chứa trường `use_ac3: bool = True` để client có thể tắt AC-3 nếu cần.
