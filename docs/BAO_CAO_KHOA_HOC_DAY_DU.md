# BÁO CÁO KHOA HỌC: HỆ THỐNG XẾP THỜI KHÓA BIỂU THÔNG MINH SỬ DỤNG CÁC GIẢI THUẬT TỐI ƯU HÓA

**Nhóm thực hiện:** Tài - Đức - Hoàng  
**Ngày:** 21/05/2026  
**Phiên bản:** 2.0

---

# MỤC LỤC

1. [Chương 1: Tổng quan về Trí tuệ nhân tạo](#chuong-1)
2. [Chương 2: Các thành tựu nổi bật và xu hướng AI](#chuong-2)
3. [Chương 3: Bài toán cụ thể](#chuong-3)
   - 3.1. Lịch sử bài toán
   - 3.2. Các giải pháp đã có
   - 3.3. Phân tích bài toán
   - 3.4. Phân tích giải thuật
   - 3.5. Cài đặt
   - 3.6. Kết quả
4. [Kết luận](#ket-luan)

---

<a name="chuong-1"></a>
# CHƯƠNG 1: TỔNG QUAN VỀ TRÍ TUỆ NHÂN TẠO

## 1.1. Định nghĩa Trí tuệ nhân tạo

Trí tuệ nhân tạo (Artificial Intelligence - AI) là một lĩnh vực nghiên cứu trong khoa học máy tính nhằm tạo ra các hệ thống có khả năng thực hiện các nhiệm vụ đòi hỏi trí thông minh của con người. Theo John McCarthy (1956), cha đẻ của thuật ngữ AI, trí tuệ nhân tạo là "khoa học và kỹ thuật tạo ra các máy móc thông minh, đặc biệt là các chương trình máy tính thông minh".

## 1.2. Các nhánh chính của AI

### 1.2.1. Machine Learning (Học máy)
Học máy là nhánh của AI cho phép máy tính học từ dữ liệu mà không cần được lập trình tường minh. Các thuật toán học máy có thể:
- Nhận diện mẫu (pattern recognition)
- Dự đoán kết quả dựa trên dữ liệu lịch sử
- Tự động cải thiện hiệu suất theo thời gian

### 1.2.2. Deep Learning (Học sâu)
Deep Learning là một nhánh con của Machine Learning, sử dụng mạng neural nhân tạo nhiều lớp (deep neural networks) để học biểu diễn dữ liệu ở nhiều mức độ trừu tượng khác nhau.

### 1.2.3. Natural Language Processing (Xử lý ngôn ngữ tự nhiên)
NLP cho phép máy tính hiểu, phân tích và sinh ra ngôn ngữ tự nhiên của con người. Ứng dụng bao gồm:
- Dịch máy (Google Translate)
- Chatbot và trợ lý ảo (ChatGPT, Siri, Alexa)
- Phân tích cảm xúc (sentiment analysis)

### 1.2.4. Computer Vision (Thị giác máy tính)
Computer Vision cho phép máy tính "nhìn" và hiểu hình ảnh, video. Ứng dụng:
- Nhận diện khuôn mặt
- Xe tự lái
- Chẩn đoán y tế từ hình ảnh

### 1.2.5. Optimization Algorithms (Giải thuật tối ưu hóa)
Các giải thuật tối ưu hóa tìm kiếm nghiệm tốt nhất trong không gian tìm kiếm lớn. Bao gồm:
- **Metaheuristic algorithms**: Genetic Algorithm, Simulated Annealing, Particle Swarm Optimization
- **Exact algorithms**: Branch and Bound, Dynamic Programming
- **Hybrid approaches**: Kết hợp nhiều phương pháp

## 1.3. Ứng dụng AI trong thực tế

### 1.3.1. Y tế
- Chẩn đoán bệnh từ hình ảnh X-quang, CT, MRI
- Phát hiện ung thư sớm
- Phát triển thuốc mới (drug discovery)
- Hỗ trợ phẫu thuật robot

### 1.3.2. Giáo dục
- Hệ thống dạy học thích ứng (adaptive learning)
- Chấm điểm tự động
- **Xếp thời khóa biểu tự động** (đề tài của nhóm)
- Chatbot hỗ trợ học tập

### 1.3.3. Kinh doanh
- Dự đoán nhu cầu khách hàng
- Tối ưu hóa chuỗi cung ứng
- Phát hiện gian lận tài chính
- Hệ thống gợi ý sản phẩm (recommendation systems)

### 1.3.4. Giao thông
- Xe tự lái (Tesla, Waymo)
- Tối ưu hóa lộ trình giao hàng
- Quản lý giao thông thông minh
- Dự đoán tắc đường

## 1.4. Vai trò của AI trong giải quyết bài toán tối ưu hóa

Các bài toán tối ưu hóa tổ hợp (combinatorial optimization) như xếp lịch, định tuyến, phân bổ tài nguyên thường thuộc lớp NP-hard - không gian tìm kiếm tăng theo hàm mũ với kích thước đầu vào. AI cung cấp các giải thuật metaheuristic có khả năng:

1. **Tìm kiếm hiệu quả**: Khám phá không gian tìm kiếm lớn trong thời gian chấp nhận được
2. **Thoát local optimum**: Tránh bị kẹt tại nghiệm cục bộ
3. **Cân bằng exploration-exploitation**: Vừa khám phá vùng mới, vừa khai thác vùng tốt
4. **Thích ứng**: Tự động điều chỉnh tham số theo đặc điểm bài toán

---

<a name="chuong-2"></a>
# CHƯƠNG 2: CÁC THÀNH TỰU NỔI BẬT VÀ XU HƯỚNG AI

## 2.1. Các thành tựu nổi bật trong những năm gần đây

### 2.1.1. Large Language Models (2020-2024)

**GPT-3 và GPT-4 (OpenAI)**
- GPT-3 (2020): 175 tỷ tham số, khả năng sinh văn bản tự nhiên
- GPT-4 (2023): Đa phương thức (text + image), lý luận phức tạp hơn
- ChatGPT (2022): Ứng dụng GPT cho chatbot, đạt 100 triệu người dùng trong 2 tháng

**Claude (Anthropic)**
- Claude 3 (2024): Cạnh tranh trực tiếp với GPT-4
- Tập trung vào an toàn và đạo đức AI

**Gemini (Google)**
- Gemini Ultra (2024): Vượt GPT-4 trên nhiều benchmark
- Tích hợp sâu vào hệ sinh thái Google

### 2.1.2. Computer Vision

**DALL-E, Midjourney, Stable Diffusion (2022-2023)**
- Sinh hình ảnh từ mô tả văn bản (text-to-image)
- Chất lượng gần như ảnh thật
- Ứng dụng: Thiết kế, quảng cáo, nghệ thuật

**Segment Anything Model - SAM (Meta, 2023)**
- Phân đoạn bất kỳ đối tượng nào trong ảnh
- Không cần training cho từng loại đối tượng

### 2.1.3. Reinforcement Learning

**AlphaGo và AlphaZero (DeepMind)**
- AlphaGo (2016): Đánh bại kỳ thủ cờ vây hàng đầu thế giới
- AlphaZero (2017): Tự học cờ vua, cờ vây, shogi từ đầu

**AlphaFold (DeepMind, 2020-2022)**
- Dự đoán cấu trúc protein 3D với độ chính xác cao
- Giải quyết bài toán 50 năm của sinh học
- Giải Nobel Hóa học 2024 (dự đoán)

### 2.1.4. Multimodal AI

**GPT-4V (Vision)**
- Hiểu cả text và image
- Phân tích biểu đồ, sơ đồ, ảnh y tế

**Gemini 1.5 Pro**
- Context window 1 triệu tokens
- Xử lý video, audio, text đồng thời

### 2.1.5. AI trong Optimization

**AlphaTensor (DeepMind, 2022)**
- Tìm thuật toán nhân ma trận nhanh hơn
- Vượt qua thuật toán tốt nhất của con người (50 năm)

**Neural Combinatorial Optimization**
- Sử dụng deep learning để giải bài toán tối ưu hóa tổ hợp
- Ứng dụng: TSP, Vehicle Routing, Job Scheduling

## 2.2. Xu hướng AI trong tương lai gần (2024-2027)

### 2.2.1. AI Agents (Tác nhân AI tự động)

**Định nghĩa**: AI agents là các hệ thống có khả năng:
- Lập kế hoạch nhiều bước
- Sử dụng công cụ (tools)
- Tự động thực hiện nhiệm vụ phức tạp

**Ví dụ**:
- AutoGPT: Tự động phân tích yêu cầu, lập kế hoạch, thực thi
- Microsoft Copilot: Tích hợp vào Office 365
- GitHub Copilot: Hỗ trợ lập trình

**Ứng dụng trong tương lai**:
- AI agent tự động xếp lịch họp, quản lý email
- AI agent nghiên cứu khoa học tự động
- AI agent phát triển phần mềm end-to-end

### 2.2.2. Multimodal Foundation Models

**Xu hướng**: Các mô hình nền tảng (foundation models) sẽ xử lý đồng thời nhiều loại dữ liệu:
- Text, image, video, audio, code
- Hiểu ngữ cảnh phức tạp hơn
- Sinh nội dung đa phương thức

**Ứng dụng**:
- Trợ lý ảo toàn diện (nhìn, nghe, nói, hiểu)
- Giáo dục cá nhân hóa (adaptive learning)
- Y tế chính xác (precision medicine)

### 2.2.3. AI for Science

**Xu hướng**: AI trở thành công cụ nghiên cứu khoa học chính thống:
- Phát hiện thuốc mới (drug discovery)
- Thiết kế vật liệu mới (materials science)
- Dự đoán thời tiết, khí hậu
- Vật lý năng lượng cao (particle physics)

**Ví dụ**:
- AlphaFold 3 (2024): Dự đoán tương tác protein-DNA-RNA
- AI giải phương trình vi phân (PINNs - Physics-Informed Neural Networks)

### 2.2.4. Edge AI và On-Device AI

**Xu hướng**: AI chạy trực tiếp trên thiết bị (smartphone, IoT) thay vì cloud:
- Giảm độ trễ (latency)
- Bảo mật dữ liệu tốt hơn
- Hoạt động offline

**Công nghệ**:
- Model compression (nén mô hình)
- Quantization (lượng tử hóa)
- Neural Architecture Search (NAS)

### 2.2.5. AI trong Optimization và Scheduling

**Xu hướng cụ thể cho đề tài**:

1. **Hybrid AI-Optimization**:
   - Kết hợp deep learning với metaheuristic
   - Neural networks học heuristic tốt từ dữ liệu
   - Ví dụ: Neural Combinatorial Optimization

2. **Reinforcement Learning for Scheduling**:
   - RL agent học chính sách xếp lịch tối ưu
   - Thích ứng với thay đổi động (dynamic scheduling)

3. **Explainable AI (XAI)**:
   - Giải thích tại sao AI chọn lịch này
   - Quan trọng cho ứng dụng thực tế (trust)

4. **AutoML for Optimization**:
   - Tự động chọn thuật toán phù hợp
   - Tự động điều chỉnh tham số (hyperparameter tuning)

5. **Quantum-Inspired Optimization**:
   - Thuật toán lấy cảm hứng từ máy tính lượng tử
   - Giải bài toán tối ưu hóa lớn hơn

## 2.3. Thách thức và hạn chế

### 2.3.1. Thách thức kỹ thuật
- **Hallucination**: AI sinh thông tin sai lệch
- **Bias**: Thiên kiến từ dữ liệu training
- **Interpretability**: Khó giải thích quyết định của AI
- **Robustness**: Dễ bị tấn công adversarial

### 2.3.2. Thách thức đạo đức và xã hội
- Thất nghiệp do tự động hóa
- Quyền riêng tư dữ liệu
- Deepfake và misinformation
- AI arms race (cuộc đua vũ trang AI)

### 2.3.3. Thách thức môi trường
- Training GPT-3 thải ra ~500 tấn CO2
- Tiêu thụ năng lượng khổng lồ của data centers
- Cần AI xanh (Green AI)

---

<a name="chuong-3"></a>
# CHƯƠNG 3: BÀI TOÁN CỤ THỂ

## 3.1. Lịch sử bài toán xếp thời khóa biểu

### 3.1.1. Nguồn gốc

Bài toán xếp thời khóa biểu (Course Timetabling Problem - CTP) xuất hiện từ những năm 1960 khi các trường đại học bắt đầu sử dụng máy tính để quản lý. Đây là một trong những bài toán tối ưu hóa tổ hợp kinh điển thuộc lớp **NP-hard**.

**Định nghĩa chính thức** (Gotlieb, 1963):
> "Gán N môn học vào M khung giờ sao cho thỏa mãn các ràng buộc cứng (hard constraints) và tối thiểu hóa vi phạm các ràng buộc mềm (soft constraints)."

### 3.1.2. Phân loại bài toán

Theo Lewis (2008), bài toán xếp lịch được chia thành 3 loại chính:

1. **School Timetabling**: Xếp lịch cho trường phổ thông
   - Lớp cố định, giáo viên di chuyển
   - Ràng buộc đơn giản hơn

2. **University Course Timetabling**: Xếp lịch đại học
   - Sinh viên tự chọn môn
   - Ràng buộc phức tạp (phòng học, giảng viên, thiết bị)
   - **Đề tài của nhóm thuộc loại này**

3. **Examination Timetabling**: Xếp lịch thi
   - Tránh sinh viên thi 2 môn cùng lúc
   - Phân bổ phòng thi

### 3.1.3. Độ phức tạp

**Không gian tìm kiếm**: O(M^N)
- N = số môn học
- M = số khung giờ

**Ví dụ**:
- 10 môn, 21 khung giờ: 21^10  1.67  10^13 khả năng
- 20 môn, 30 khung giờ: 30^20  3.49  10^29 khả năng

 Không thể duyệt toàn bộ (brute force) ngay cả với siêu máy tính

### 3.1.4. Các mốc quan trọng

| Năm | Sự kiện |
|-----|---------|
| 1963 | Gotlieb đề xuất bài toán chính thức đầu tiên |
| 1976 | Even et al. chứng minh CTP là NP-complete |
| 1985 | Colorni et al. áp dụng Genetic Algorithm |
| 1996 | Abramson áp dụng Simulated Annealing |
| 2002 | ITC (International Timetabling Competition) lần đầu |
| 2007 | ITC-2007: Benchmark chuẩn quốc tế |
| 2019 | Deep Reinforcement Learning cho scheduling |
| 2023 | Neural Combinatorial Optimization |

## 3.2. Các giải pháp đã có

### 3.2.1. Phương pháp chính xác (Exact Methods)

**Integer Programming (IP)**
- Mô hình hóa bài toán thành bài toán quy hoạch nguyên
- Sử dụng solver: CPLEX, Gurobi
- **Ưu điểm**: Tìm được nghiệm tối ưu toàn cục
- **Nhược điểm**: Chỉ giải được bài toán nhỏ (< 50 môn)

**Constraint Programming (CP)**
- Sử dụng lan truyền ràng buộc (constraint propagation)
- Solver: Google OR-Tools, Choco
- **Ưu điểm**: Linh hoạt, dễ mô hình hóa
- **Nhược điểm**: Chậm với bài toán lớn

### 3.2.2. Phương pháp metaheuristic

**Genetic Algorithm (GA)**
- Colorni et al. (1985): Ứng dụng đầu tiên cho CTP
- Burke et al. (2007): GA với adaptive operators
- **Ưu điểm**: Tìm kiếm toàn cục tốt
- **Nhược điểm**: Nhiều tham số cần điều chỉnh

**Simulated Annealing (SA)**
- Abramson (1991): SA cho university timetabling
- Thompson & Dowsland (1996): SA với reheating
- **Ưu điểm**: Đơn giản, hiệu quả
- **Nhược điểm**: Phụ thuộc cooling schedule

**Tabu Search (TS)**
- Hertz (1991): TS cho school timetabling
- Di Gaspero & Schaerf (2001): TS với adaptive memory
- **Ưu điểm**: Tránh cycling hiệu quả
- **Nhược điểm**: Cần điều chỉnh tenure

**Ant Colony Optimization (ACO)**
- Socha et al. (2002): ACO cho examination timetabling
- **Ưu điểm**: Phù hợp bài toán đồ thị
- **Nhược điểm**: Chậm hội tụ

### 3.2.3. Phương pháp hybrid

**Memetic Algorithm**
- Kết hợp GA với local search
- Burke et al. (2010): Thắng ITC-2007
- **Ưu điểm**: Kết hợp ưu điểm GA và local search

**Hyper-heuristic**
- Chọn heuristic phù hợp cho từng giai đoạn
- Ozcan et al. (2008): Adaptive hyper-heuristic
- **Ưu điểm**: Tự động, không cần điều chỉnh tham số

### 3.2.4. Phương pháp học máy

**Reinforcement Learning**
- Zhang & Dietterich (1995): RL cho job shop scheduling
- Mao et al. (2019): RL cho cluster scheduling
- **Ưu điểm**: Học từ kinh nghiệm, thích ứng động

**Neural Combinatorial Optimization**
- Vinyals et al. (2015): Pointer Networks
- Kool et al. (2019): Attention Model
- **Ưu điểm**: End-to-end learning, không cần heuristic

### 3.2.5. Các hệ thống thương mại

| Hệ thống | Công ty | Phương pháp |
|----------|---------|-------------|
| Syllabus Plus | Scientia | Constraint-based |
| UniTime | Purdue University | Mixed Integer Programming |
| FET | Open source | Simulated Annealing |
| Mimosa | Mimosa Software | Genetic Algorithm |

### 3.2.6. So sánh với đề tài của nhóm

**Điểm khác biệt**:
1. **Đa thuật toán**: Triển khai 4 thuật toán (GA, HC, SA, Minimax) để so sánh
2. **Xử lý xung đột thông minh**: Tự động tìm session thay thế
3. **Giao diện web**: Dễ sử dụng, không cần cài đặt
4. **Convergence visualization**: Biểu đồ hội tụ trực quan
5. **Benchmark tích hợp**: So sánh khách quan

**Hạn chế so với hệ thống thương mại**:
- Chưa xử lý phòng học, thiết bị
- Chưa có tối ưu hóa giảng viên
- Chưa hỗ trợ ràng buộc phức tạp (curriculum, spread)


## 3.3. Phân tích bài toán

### 3.3.1. Định nghĩa bài toán Smart Scheduler

**Đầu vào**:
- N môn học, mỗi môn có:
  - Tên môn, giảng viên, số tín chỉ
  - Ngày học (T2-CN), giờ học (start_time, end_time)
  - Khoảng thời gian (start_date, end_date)
  - Độ ưu tiên (1-10)
  - Các thuộc tính: is_retake, preferred_days
- M khung giờ: 21 slots (T2-CN  Sáng/Chiều/Tối)
- Ràng buộc:
  - Hard: Slot bị cấm, xung đột thời gian
  - Soft: Cân bằng ngày, ưu tiên buổi sáng, tránh T7

**Đầu ra**:
- Lịch học: Gán mỗi môn vào 1 slot
- Chi phí (penalty score): Tổng vi phạm ràng buộc
- Danh sách môn bị loại (nếu có)
- Danh sách session thay thế (nếu có)
- Convergence log (quá trình hội tụ)

**Mục tiêu**: Tối thiểu hóa penalty score

### 3.3.2. Mô hình hóa toán học

**Biến quyết định**:
`
x[i][j]  {0, 1}
x[i][j] = 1 nếu môn i được gán vào slot j
x[i][j] = 0 ngược lại
`

**Ràng buộc cứng**:
`
1. Mỗi môn chỉ được gán vào 1 slot:
   (j=1 to M) x[i][j] = 1, i  {1..N}

2. Tránh xung đột slot:
   (i=1 to N) x[i][j]  1, j  {1..M}

3. Slot bị cấm:
   x[i][j] = 0, j  forbidden_slots[i]
`

**Hàm mục tiêu**:
`
Minimize: f(x) =  penalty_k(x)

Trong đó penalty_k là các thành phần penalty:
- penalty_collision: Xung đột slot
- penalty_forbidden: Slot bị cấm
- penalty_consecutive: Môn liên tiếp
- penalty_balance: Mất cân bằng ngày
- penalty_afternoon: Buổi chiều
- penalty_saturday: Thứ 7
- penalty_unavailable: Slot không khả dụng
- bonus_preferred: Ngày ưa thích
- bonus_retake: Môn học lại buổi sáng
`

### 3.3.3. Biểu diễn nghiệm (Solution Encoding)

**Chromosome (Individual)**:
`
individual = [s, s, s, ..., s_{N-1}]
`

Trong đó:
- individual[i] = chỉ số slot được gán cho môn i
-    individual[i] < M

**Ví dụ**:
`
Subjects: ["Toán", "Lý", "Hóa", "Anh", "Văn"]
Time slots: 21 slots (0-20)

Individual: [3, 7, 12, 0, 18]
 Toán ở slot 3 (T2_Tối)
 Lý ở slot 7 (T3_Chiều)
 Hóa ở slot 12 (T4_Sáng)
 Anh ở slot 0 (T2_Sáng)
 Văn ở slot 18 (T6_Sáng)
`

**Ưu điểm của encoding này**:
- Đơn giản, dễ hiểu
- Dễ implement các toán tử GA (crossover, mutation)
- Không gian tìm kiếm: M^N

### 3.3.4. Phân tích độ phức tạp

**Không gian tìm kiếm**:
`
|S| = M^N

Với M=21, N=10: |S| = 21^10  1.67  10^13
`

**Thời gian duyệt toàn bộ** (giả sử 1 tỷ nghiệm/giây):
`
T = 1.67  10^13 / 10^9 = 16,700 giây  4.6 giờ
`

 Vẫn khả thi với N=10, nhưng với N=20:
`
|S| = 21^20  2.79  10^26
T  8.8  10^9 năm (lớn hơn tuổi vũ trụ!)
`

 **Cần giải thuật metaheuristic**

### 3.3.5. Đặc điểm bài toán

1. **NP-hard**: Không có thuật toán đa thức tìm nghiệm tối ưu
2. **Combinatorial**: Không gian tìm kiếm rời rạc
3. **Multi-objective**: Nhiều mục tiêu (hard + soft constraints)
4. **Dynamic**: Có thể thay đổi theo thời gian (thêm/bớt môn)
5. **Constrained**: Nhiều ràng buộc phức tạp

### 3.3.6. Thách thức

1. **Không gian tìm kiếm lớn**: M^N tăng theo hàm mũ
2. **Nhiều local optimum**: Dễ bị kẹt
3. **Ràng buộc phức tạp**: Hard + soft constraints
4. **Xung đột thời gian**: Cần xử lý thông minh
5. **Cân bằng mục tiêu**: Trade-off giữa các ràng buộc

---

## 3.4. Phân tích giải thuật

### 3.4.1. Tổng quan 4 giải thuật

Hệ thống Smart Scheduler triển khai 4 giải thuật metaheuristic:

| Giải thuật | Loại | Đặc điểm chính |
|------------|------|----------------|
| **Genetic Algorithm (GA)** | Population-based | Tiến hóa quần thể qua selection, crossover, mutation |
| **Hill Climbing (HC)** | Local search | Leo đồi từ nghiệm ngẫu nhiên, restart khi kẹt |
| **Simulated Annealing (SA)** | Local search | Chấp nhận nghiệm xấu hơn với xác suất giảm dần |
| **Minimax + Alpha-Beta** | Adversarial search | Tìm kiếm đối kháng với cắt tỉa |

### 3.4.2. Genetic Algorithm (GA)

**Nguyên lý**: Mô phỏng tiến hóa tự nhiên

**Các thành phần**:

1. **Initialization**: Tạo quần thể ngẫu nhiên (100 cá thể)
`python
population = [create_individual() for _ in range(100)]
`

2. **Selection**: Tournament selection (k=5)
`python
def selection(population_with_scores):
    tournament = random.sample(population_with_scores, 5)
    tournament.sort(key=lambda x: x[1])  # Sắp xếp theo penalty
    return tournament[0][0], tournament[1][0]  # 2 cá thể tốt nhất
`

3. **Crossover**: Single-point crossover
`python
def crossover(parent1, parent2):
    point = random.randint(1, N-1)
    child1 = parent1[:point] + parent2[point:]
    child2 = parent2[:point] + parent1[point:]
    return child1, child2
`

4. **Mutation**: Thay đổi ngẫu nhiên 1 gen (10%)
`python
def mutate(individual):
    if random.random() < 0.1:
        i = random.randint(0, N-1)
        individual[i] = random.randint(0, M-1)
    return individual
`

5. **Elitism**: Giữ 10% cá thể tốt nhất
`python
elitism_count = int(100 * 0.1)  # 10 cá thể
new_population.extend(best_individuals[:elitism_count])
`

**Tham số**:
- Population size: 100
- Generations: 200
- Mutation rate: 0.1
- Elitism rate: 0.1
- Tournament size: 5

**Độ phức tạp**:
- Thời gian: O(G  P  N) = O(200  100  N) = O(20,000  N)
- Không gian: O(P  N) = O(100  N)

**Ưu điểm**:
- Tìm kiếm toàn cục tốt (global search)
- Khám phá song song nhiều vùng
- Không dễ bị kẹt local optimum

**Nhược điểm**:
- Tốn nhiều tài nguyên (20,000 lần gọi fitness)
- Nhiều tham số cần điều chỉnh
- Hội tụ chậm

### 3.4.3. Hill Climbing (HC)

**Nguyên lý**: Leo đồi từ nghiệm ngẫu nhiên

**Steepest-Ascent Hill Climbing**:
`python
def hill_climbing():
    for restart in range(50):
        current = random_solution()
        current_cost = fitness(current)
        
        improved = True
        while improved:
            improved = False
            best_neighbor = None
            best_cost = current_cost
            
            # Đánh giá TẤT CẢ láng giềng
            for i in range(N):
                for s in range(M):
                    if s == current[i]:
                        continue
                    neighbor = current.copy()
                    neighbor[i] = s
                    cost = fitness(neighbor)
                    
                    if cost < best_cost:
                        best_cost = cost
                        best_neighbor = neighbor
            
            # Di chuyển nếu có cải thiện
            if best_neighbor and best_cost < current_cost:
                current = best_neighbor
                current_cost = best_cost
                improved = True
`

**Tham số**:
- Random restarts: 50
- Max iterations: 5000

**Độ phức tạp**:
- Mỗi bước: O(N  M) láng giềng
- Tổng: O(I  N  M) = O(5000  N  M)

**Ưu điểm**:
- Đơn giản, dễ implement
- Nhanh với bài toán nhỏ
- Đảm bảo tìm local optimum

**Nhược điểm**:
- Dễ bị kẹt local optimum
- Phụ thuộc điểm khởi đầu
- Cần nhiều restart

### 3.4.4. Simulated Annealing (SA)

**Nguyên lý**: Mô phỏng quá trình luyện kim

**Xác suất chấp nhận**:
`
P(accept) = exp(-Δcost / T)

Trong đó:
- Δcost = cost_new - cost_current
- T = nhiệt độ hiện tại
`

**Thuật toán**:
`python
def simulated_annealing():
    current = random_solution()
    current_cost = fitness(current)
    best = current
    best_cost = current_cost
    T = 1000.0  # Nhiệt độ ban đầu
    
    for i in range(10000):
        # Tạo láng giềng ngẫu nhiên
        neighbor = random_neighbor(current)
        neighbor_cost = fitness(neighbor)
        
        delta = neighbor_cost - current_cost
        
        if delta <= 0:
            # Tốt hơn: chấp nhận
            current = neighbor
            current_cost = neighbor_cost
        else:
            # Xấu hơn: chấp nhận với xác suất
            p = math.exp(-delta / T)
            if random.random() < p:
                current = neighbor
                current_cost = neighbor_cost
        
        # Cập nhật best
        if current_cost < best_cost:
            best = current
            best_cost = current_cost
        
        # Làm nguội
        T = T * 0.995
        
        if T < 0.01:
            break
    
    return best, best_cost
`

**Tham số**:
- T_initial: 1000.0
- alpha (cooling rate): 0.995
- T_min: 0.01
- max_iter: 10000

**Độ phức tạp**:
- Thời gian: O(max_iter) = O(10,000)
- Không gian: O(N)

**Ưu điểm**:
- Có thể thoát local optimum
- Nhanh (chỉ 1 láng giềng/bước)
- Cân bằng exploration-exploitation

**Nhược điểm**:
- Phụ thuộc cooling schedule
- Khó chọn tham số tối ưu
- Không đảm bảo global optimum

### 3.4.5. Minimax + Alpha-Beta Pruning

**Nguyên lý**: Tìm kiếm đối kháng (adversarial search)

**Mô hình**:
- MAX player: Chọn slot tối thiểu hóa cost
- MIN player: Chọn slot tối đại hóa cost (worst-case)

**Thuật toán**:
`python
def minimax(depth, subject_index, assignment, alpha, beta, is_maximizing):
    # Terminal: đạt depth limit
    if depth >= depth_limit or subject_index >= N:
        completed = complete_assignment(assignment)
        return fitness(completed)
    
    candidates = get_candidate_slots()  # Max 8 slots
    
    if is_maximizing:
        # MAX: tối thiểu hóa
        value = float('inf')
        for slot in candidates:
            assignment[subject_index] = slot
            value = min(value, minimax(depth+1, subject_index+1, 
                                       assignment, alpha, beta, False))
            beta = min(beta, value)
            if beta <= alpha:  # Alpha-Beta pruning
                break
        return value
    else:
        # MIN: tối đại hóa
        value = float('-inf')
        for slot in candidates:
            assignment[subject_index] = slot
            value = max(value, minimax(depth+1, subject_index+1,
                                       assignment, alpha, beta, True))
            alpha = max(alpha, value)
            if beta <= alpha:  # Alpha-Beta pruning
                break
        return value
`

**Tham số**:
- depth_limit: min(6, N)
- max_branching: 8

**Độ phức tạp**:
- Worst case: O(b^d) = O(8^6) = 262,144
- Best case (pruning): O(b^(d/2)) = O(8^3) = 512
- Average: O(b^(3d/4))  4,096

**Ưu điểm**:
- Tìm nghiệm robust (tốt trong worst-case)
- Deterministic (kết quả nhất quán)
- Có cơ sở lý thuyết vững

**Nhược điểm**:
- Không phù hợp bài toán xếp lịch (không đối kháng)
- Phải giới hạn depth  nghiệm không tối ưu
- Chậm khi N lớn

### 3.4.6. So sánh 4 giải thuật

| Tiêu chí | GA | HC | SA | Minimax |
|----------|----|----|----|---------| 
| **Loại** | Population | Local | Local | Adversarial |
| **Số lần gọi fitness** | ~20,000 | ~5,000 | ~10,000 | ~4,000-262,000 |
| **Bộ nhớ** | O(100N) | O(N) | O(N) | O(6N) |
| **Thoát local optimum** | Tốt | Yếu | Trung bình | N/A |
| **Tốc độ** | Trung bình | Nhanh | Nhanh nhất | Chậm |
| **Chất lượng** | Tốt nhất | Trung bình | Tốt | Kém (N>6) |
| **Deterministic** | Không | Không | Không | Có |
| **Phù hợp** | Bài toán lớn | Bài toán nhỏ | Cân bằng | Không phù hợp |

