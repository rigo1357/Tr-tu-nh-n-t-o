# BAO CAO TONG HOP DU AN: SMART SCHEDULER
## He thong Xep Thoi Khoa Bieu Thong Minh Su Dung Cac Giai Thuat Toi Uu Hoa

> **Ngay tao:** 14/05/2026
> **Phien ban:** 1.0 (Hien tai) + AI Algorithm Improvements (Ke hoach)

---

# MUC LUC

1. Tong quan du an
2. Kien truc he thong
3. Co so ly thuyet cac giai thuat
4. Mo ta chi tiet tung giai thuat
5. Ham danh gia (Fitness Function)
6. Phuong phap danh gia va so sanh giai thuat
7. Xay dung giai phap bai toan
8. Hien thi ket qua va so sanh
9. Ke hoach cai tien AI (AI Algorithm Improvements)
10. Cau truc du an
11. Cong nghe su dung


---

# 1. TONG QUAN DU AN

## 1.1 Ten de tai

**He thong Xep Thoi Khoa Bieu Thong Minh Cho Sinh Vien Dai Hoc Su Dung Cac Giai Thuat Toi Uu Hoa Metaheuristic**

*(Smart Scheduler - Intelligent University Course Scheduling System Using Metaheuristic Optimization Algorithms)*

## 1.2 Mo ta bai toan

Xep thoi khoa bieu la bai toan NP-hard kinh dien trong khoa hoc may tinh. Voi N mon hoc va M khung gio,
khong gian tim kiem co kich thuoc M^N - voi 10 mon va 21 khung gio la 21^10 ~ 1.67 ty kha nang.

He thong Smart Scheduler giai quyet bai toan nay bang cach:
- Nhan dau vao: danh sach mon hoc, rang buoc thoi gian, do uu tien
- Chay cac giai thuat toi uu hoa de tim lich tot nhat
- Tra ve: thoi khoa bieu toi uu hoa kem theo chi phi (penalty score)

## 1.3 Muc tieu

- Xep lich tu dong, tranh trung gio giua cac mon
- Toi thieu hoa cac vi pham rang buoc mem (soft constraints)
- So sanh hieu qua cua nhieu giai thuat toi uu hoa
- Cung cap giao dien web de nguoi dung tuong tac
- Ho tro quan tri vien quan ly mon hoc, nguoi dung


---

# 2. KIEN TRUC HE THONG

## 2.1 Tong the


## 2.2 Backend (smart-scheduler-api)

| File | Chuc nang |
|------|-----------|
| main.py | FastAPI app, tat ca API endpoints, dispatcher giai thuat |
| schemas.py | Pydantic models: ScheduleInput, SubjectInput, CourseBase... |
| auth/security.py | JWT authentication, bcrypt password hashing |
| db/models.py | Beanie Document models: User, Schedule, Course, OTP |
| db/database.py | Ket noi MongoDB, khoi tao Beanie |
| genetic_algorithm/base.py | BaseScheduler - lop co so cho tat ca giai thuat |
| genetic_algorithm/fitness.py | Ham danh gia fitness (single source of truth) |
| genetic_algorithm/scheduler_ga.py | Genetic Algorithm (GA) |
| genetic_algorithm/simulated_annealing.py | Simulated Annealing (SA) |
| genetic_algorithm/hill_climbing.py | Hill Climbing (HC) |
| genetic_algorithm/minimax_scheduler.py | Minimax + Alpha-Beta Pruning |

## 2.3 Frontend (smart-scheduler-ui)

| File | Chuc nang |
|------|-----------|
| src/App.js | Router chinh, dinh tuyen trang |
| src/pages/AuthPage.js | Dang nhap / Dang ky |
| src/pages/HomePage.js | Trang chu |
| src/pages/SchedulerPage.js | Trang xep lich chinh - nhap mon, chay giai thuat, hien thi ket qua |
| src/pages/AdminPage.js | Quan tri: quan ly mon hoc, nguoi dung |
| src/pages/ProblemFormulationPage.js | Trang mo ta bai toan |
| src/services/api.js | Axios API client |
| src/context/AuthContext.js | Quan ly trang thai dang nhap |
| src/utils/exportSchedule.js | Xuat lich ra PDF/Excel |


---

# 2. KIEN TRUC HE THONG

## 2.1 Tong the

He thong gom 2 thanh phan chinh:
- **Frontend**: React (smart-scheduler-ui) - giao dien nguoi dung
- **Backend**: FastAPI Python (smart-scheduler-api) - xu ly logic, chay giai thuat
- **Database**: MongoDB (qua Beanie ODM) - luu tru user, lich hoc, mon hoc

Luong xu ly chinh:
1. Nguoi dung nhap danh sach mon hoc + rang buoc tren giao dien
2. Frontend gui POST /api/schedule den Backend
3. Backend chay giai thuat toi uu hoa duoc chon
4. Tra ve lich hoc toi uu + chi phi penalty + convergence log

## 2.2 Backend (smart-scheduler-api)

| File | Chuc nang |
|------|-----------|
| main.py | FastAPI app, tat ca API endpoints, dispatcher giai thuat |
| schemas.py | Pydantic models: ScheduleInput, SubjectInput, CourseBase |
| auth/security.py | JWT authentication, bcrypt password hashing |
| db/models.py | Beanie Document models: User, Schedule, Course, OTP |
| db/database.py | Ket noi MongoDB, khoi tao Beanie |
| genetic_algorithm/base.py | BaseScheduler - lop co so cho tat ca giai thuat |
| genetic_algorithm/fitness.py | Ham danh gia fitness (single source of truth) |
| genetic_algorithm/scheduler_ga.py | Genetic Algorithm (GA) |
| genetic_algorithm/simulated_annealing.py | Simulated Annealing (SA) |
| genetic_algorithm/hill_climbing.py | Hill Climbing (HC) |
| genetic_algorithm/minimax_scheduler.py | Minimax + Alpha-Beta Pruning |

## 2.3 Frontend (smart-scheduler-ui)

| File | Chuc nang |
|------|-----------|
| src/App.js | Router chinh, dinh tuyen trang |
| src/pages/AuthPage.js | Dang nhap / Dang ky |
| src/pages/SchedulerPage.js | Trang xep lich chinh |
| src/pages/AdminPage.js | Quan tri: quan ly mon hoc, nguoi dung |
| src/services/api.js | Axios API client |
| src/context/AuthContext.js | Quan ly trang thai dang nhap |
| src/utils/exportSchedule.js | Xuat lich ra PDF/Excel |


---

# 3. CO SO LY THUYET CAC GIAI THUAT

## 3.1 Ma hoa bai toan (Problem Encoding)

Tat ca giai thuat dung chung mot cach ma hoa:
- **Individual (chromosome)**: mot list[int] co do dai = so mon hoc
- **individual[i]** = chi so slot (khung gio) duoc gan cho mon hoc thu i
- **Vi du**: 5 mon hoc, 21 slot => individual = [3, 7, 12, 0, 18]
  - Mon 0 duoc xep vao slot 3 (T2_Toi)
  - Mon 1 duoc xep vao slot 7 (T3_Chieu)
  - ...

## 3.2 Ham danh gia (Fitness Function)

Ham fitness tinh tong penalty (phat) cho mot individual. Muc tieu la **toi thieu hoa** penalty.

**Cac rang buoc hien tai:**

| Rang buoc | Loai | Penalty mac dinh |
|-----------|------|-----------------|
| Hai mon trung slot (priority cao hon) | Cung (Hard) | 1000 |
| Hai mon trung slot (priority thap hon) | Cung (Hard) | 1500 |
| Mon bi xep vao slot cam | Cung (Hard) | 500 - (priority-5)*50 |
| Tranh mon lien tiep cung ngay | Mem (Soft) | 200/cap |
| Can bang so mon giua cac ngay | Mem (Soft) | (max-min)*50 |
| Uu tien buoi sang (phat buoi chieu) | Mem (Soft) | 100/slot |
| Khong cho hoc T7 | Mem (Soft) | 300/slot |
| Slot khong kha dung | Mem (Soft) | 800 - (priority-5)*50 |
| Uu tien ngay hoc yeu thich | Bonus | -150/slot |
| Mon hoc lai buoi sang | Bonus | -20/slot |
| Mon thuong buoi toi | Phat | +80/slot |

**Nguyen tac quan trong:**
- calculate_fitness() trong itness.py la **single source of truth** duy nhat
- Tat ca giai thuat PHAI goi ham nay, khong duoc tu implement lai logic penalty

## 3.3 Khong gian thoi gian (Time Slots)

He thong su dung 21 khung gio mac dinh:
- T2_Sang, T2_Chieu, T2_Toi
- T3_Sang, T3_Chieu, T3_Toi
- T4_Sang, T4_Chieu, T4_Toi
- T5_Sang, T5_Chieu, T5_Toi
- T6_Sang, T6_Chieu, T6_Toi
- T7_Sang, T7_Chieu, T7_Toi
- CN_Sang, CN_Chieu, CN_Toi


---

# 4. MO TA CHI TIET TUNG GIAI THUAT

## 4.1 Genetic Algorithm (GA) - scheduler_ga.py

### Nguon goc ly thuyet
Giai thuat di truyen mo phong qua trinh tien hoa tu nhien (Darwin). Quan the (population) gom nhieu ca the (individual), qua cac the he (generation) se tien hoa den nghiem tot hon qua:
- **Chon loc (Selection)**: ca the tot hon co xac suat duoc chon cao hon
- **Lai ghep (Crossover)**: ket hop gen cua 2 ca the cha me tao ca the con
- **Dot bien (Mutation)**: thay doi ngau nhien mot so gen de tang da dang

### Tham so hien tai
- Population size: 100 ca the
- So the he: 200
- Ty le dot bien: 10% (0.1)
- Elitism: giu lai 10% ca the tot nhat moi the he
- Selection: Tournament selection (kich thuoc 5)
- Crossover: Single-point crossover

### Quy trinh chay
1. Khoi tao quan the ngau nhien (100 ca the)
2. Tinh fitness cho tung ca the
3. Giu lai 10% tot nhat (elitism)
4. Chon loc tournament -> lai ghep -> dot bien -> tao the he moi
5. Lap lai 200 the he hoac den khi tim duoc nghiem hoan hao (penalty=0)
6. Tra ve lich tot nhat + convergence log

### Do phuc tap
- O(GENERATIONS x POPULATION_SIZE x num_subjects) tinh fitness
- Voi 200 the he, 100 ca the, 10 mon: ~200,000 lan tinh fitness

### Uu diem
- Tim kiem toan cuc (global search) tot
- Xu ly tot bai toan co nhieu rang buoc
- Co the thoat khoi local optimum qua dot bien

### Nhuoc diem
- Cham hon Hill Climbing voi bai toan nho
- Ket qua co tinh ngau nhien (non-deterministic)
- Can nhieu the he de hoi tu

---

## 4.2 Hill Climbing (HC) - hill_climbing.py

### Nguon goc ly thuyet
Leo doi (Hill Climbing) la giai thuat tim kiem cuc bo (local search). Bat dau tu mot nghiem ngau nhien, lien tuc di chuyen den lang gieng tot nhat cho den khi khong con cai thien duoc (local optimum).

**Phien ban su dung: Steepest-Ascent Hill Climbing voi Random Restarts**
- Moi buoc danh gia TAT CA lang gieng (thay doi 1 gen)
- Chon lang gieng tot nhat (steepest improvement)
- Khi bi ket: khoi dong lai tu nghiem ngau nhien moi

### Tham so
- Random restarts: 50 lan
- Max iterations: 5000 (tong cong qua tat ca restarts)

### Quy trinh chay
1. Khoi tao nghiem ngau nhien
2. Tao tat ca lang gieng: thay doi 1 mon sang 1 slot khac
   - So lang gieng = num_subjects x (num_slots - 1)
3. Chon lang gieng co fitness tot nhat
4. Neu tot hon hien tai: di chuyen den do
5. Neu khong co cai thien: restart tu nghiem moi
6. Lap lai den khi het budget iterations

### Do phuc tap
- Moi buoc: O(num_subjects x num_slots) tinh fitness
- Tong: O(max_iterations x num_subjects x num_slots)
- Voi 5000 iter, 10 mon, 21 slot: ~1,050,000 lan tinh fitness

### Uu diem
- Don gian, de hieu
- Nhanh voi bai toan nho
- Bao dam tim duoc local optimum

### Nhuoc diem
- De bi ket tai local optimum
- Khong co co che thoat khoi local optimum (chi restart)
- Kem hieu qua voi bai toan phuc tap

---

## 4.3 Simulated Annealing (SA) - simulated_annealing.py

### Nguon goc ly thuyet
Lua luyen (Simulated Annealing) mo phong qua trinh lam nguoi kim loai trong luyen kim. Khi nhiet do cao, he thong chap nhan ca nghiem xau hon (de thoat local optimum). Khi nhiet do giam dan, he thong tro nen chon loc hon.

**Xac suat chap nhan nghiem xau hon:**
P(chap nhan) = exp(-delta_cost / T)

Trong do:
- delta_cost = chi phi moi - chi phi hien tai (> 0 khi xau hon)
- T = nhiet do hien tai

### Tham so
- Nhiet do ban dau: T = 1000.0
- He so lam nguoi: alpha = 0.995
- Nhiet do toi thieu: T_min = 0.01
- So buoc toi da: max_iter = 10000

### Quy trinh chay
1. Khoi tao nghiem ngau nhien
2. Tao 1 lang gieng ngau nhien (thay doi 1 gen)
3. Neu tot hon: chap nhan
4. Neu xau hon: chap nhan voi xac suat exp(-delta/T)
5. Giam nhiet do: T = T * alpha
6. Lap lai den khi T < T_min hoac het max_iter

### Do phuc tap
- O(max_iter) tinh fitness
- Voi 10000 iter: 10000 lan tinh fitness (nhanh nhat trong 4 giai thuat)

### Uu diem
- Co the thoat khoi local optimum (xac suat chap nhan nghiem xau)
- Nhanh (chi 1 lang gieng moi buoc)
- Ly thuyet hoi tu den global optimum (voi schedule lam nguoi phu hop)

### Nhuoc diem
- Ket qua phu thuoc nhieu vao tham so (T, alpha)
- Kho chon tham so toi uu
- Khong bao dam tim duoc global optimum trong thuc te

---

## 4.4 Minimax + Alpha-Beta Pruning - minimax_scheduler.py

### Nguon goc ly thuyet
Minimax la giai thuat cho tro choi 2 nguoi (adversarial game). He thong duoc mo hinh hoa nhu:
- **MAX player (Scheduler)**: chon slot de TOI THIEU HOA chi phi
- **MIN player (Adversary)**: chon slot de TOI DA HOA chi phi (worst-case)

**Alpha-Beta Pruning**: cat tinh cac nhanh khong the anh huong den ket qua cuoi cung, giam do phuc tap tu O(b^d) xuong O(b^(d/2)).

### Tham so
- Depth limit: min(len(subjects), 6)
- Max branching: 8 (gioi han so nhanh de kha thi)
- Seed: 0 (deterministic)

### Quy trinh chay
1. Xay dung cay tim kiem: moi muc gan slot cho 1 mon hoc
2. MAX player chon slot toi thieu hoa worst-case cost
3. MIN player chon slot toi da hoa cost (adversary)
4. Alpha-Beta cat tinh cac nhanh khong can thiet
5. Hoan thanh cac mon chua duoc gan bang ngau nhien
6. Tra ve lich hoc + chi phi

### Do phuc tap
- O(max_branching^depth_limit) voi alpha-beta pruning
- Voi branching=8, depth=6: toi da 8^6 = 262,144 nut (thuc te it hon nhieu)

### Uu diem
- Bao dam ket qua tot nhat trong pham vi tim kiem
- Deterministic (ket qua nhat quan)
- Ly thuyet vung chac (game theory)

### Nhuoc diem
- Khong the tim kiem toan bo khong gian (depth limit)
- Cham voi nhieu mon hoc
- Phan adversary khong phan anh thuc te (khong co doi thu that su)


---

# 5. HAM DANH GIA FITNESS (CHI TIET)

## 5.1 Chuc nang

Ham calculate_fitness() trong genetic_algorithm/fitness.py la **nguon su that duy nhat** (single source of truth) cho toan bo logic penalty. Tat ca 4 giai thuat deu goi ham nay.

## 5.2 Dau vao

`
subjects: List[str]           - danh sach ten mon hoc
time_slots: List[str]         - danh sach ten slot
constraints: Dict             - rang buoc cam (mon -> [slot cam])
individual: List[int]         - nghiem can danh gia
priorities: Dict              - do uu tien (mon -> 1-10)
additional_constraints: Dict  - rang buoc bo sung
subject_details: Dict         - thong tin chi tiet mon hoc
`

## 5.3 Dau ra

Mot so float >= 0 la tong penalty. **Penalty = 0 la nghiem hoan hao.**

## 5.4 Cac rang buoc duoc tinh

### Rang buoc 1: Trung slot (Hard Constraint)
Khi 2 mon duoc xep vao cung 1 slot index:
- Mon co priority cao hon: +1000 penalty
- Mon co priority thap hon: +1500 penalty

### Rang buoc 2: Slot bi cam (Hard Constraint)
Khi mon duoc xep vao slot nam trong danh sach cam:
- Penalty = 500 - (priority - 5) * 50
- Mon priority cao bi phat it hon (vi kho tranh hon)

### Rang buoc 3: Tranh mon lien tiep (Soft - avoidConsecutive)
Khi 2 mon lien tiep trong danh sach duoc xep cung ngay:
- +200 penalty moi cap

### Rang buoc 4: Can bang ngay (Soft - balanceDays)
Tinh so mon moi ngay, phat theo su chenh lech:
- Penalty = (max_count - min_count) * 50

### Rang buoc 5: Uu tien buoi sang (Soft - preferMorning)
Moi slot buoi Chieu: +100 penalty

### Rang buoc 6: Khong hoc T7 (Soft - allowSaturday=False)
Moi slot T7: +300 penalty

### Rang buoc 7: Slot khong kha dung (Soft)
Khi mon duoc xep vao slot trong unavailable_slots:
- Penalty = 800 - (priority - 5) * 50

### Bonus: Ngay hoc yeu thich
Khi mon duoc xep vao ngay trong preferred_days: -150 penalty

### Bonus: Mon hoc lai buoi sang
Khi mon is_retake=True duoc xep buoi Sang: -20 penalty

### Phat: Mon thuong buoi toi
Khi mon is_retake=False duoc xep buoi Toi: +80 penalty

## 5.5 Vi du tinh toan

Gia su co 3 mon: Toan, Ly, Hoa
- Toan va Ly cung slot T2_Sang: +1000 (Toan priority cao) + 1500 (Ly priority thap) = 2500
- Hoa o slot T7_Chieu (khong cho T7, khong uu tien sang): +300 + 100 = 400
- Tong penalty = 2900


---

# 6. PHUONG PHAP DANH GIA VA CHON LUA GIAI THUAT

## 6.1 Chi so danh gia

He thong su dung 3 chi so chinh:

| Chi so | Mo ta | Don vi |
|--------|-------|--------|
| **Cost (Penalty Score)** | Tong penalty cua lich tot nhat tim duoc | So nguyen >= 0 |
| **Time (ms)** | Thoi gian chay thuc te | Mili giay |
| **Removed Count** | So mon bi loai do trung lich khong giai quyet duoc | So mon |

**Giai thuat tot nhat = cost thap nhat** (voi cung dau vao)

## 6.2 API So sanh (POST /api/schedule/compare)

Endpoint nay chay **ca 4 giai thuat tren cung 1 dau vao** va tra ve ket qua so sanh:

`json
{
  "results": {
    "ga":            {"cost": 450, "time_ms": 3200, "removed_count": 0},
    "hill_climbing": {"cost": 600, "time_ms": 1800, "removed_count": 0},
    "sa":            {"cost": 380, "time_ms": 850,  "removed_count": 0},
    "minimax":       {"cost": 520, "time_ms": 2100, "removed_count": 0}
  },
  "best_algorithm": "sa"
}
`

## 6.3 API Benchmark (POST /api/schedule/benchmark)

Chay 4 giai thuat tren **5 bo du lieu chuan** (fixed seed=42):

| Bo du lieu | So mon | So xung dot |
|------------|--------|-------------|
| Nho | 3 | 0 |
| Vua | 5 | 1 |
| Trung binh | 7 | 2 |
| Lon | 10 | 3 |
| Rat lon | 12 | 4 |

Ket qua benchmark cho phep so sanh khach quan, khong phu thuoc vao du lieu nguoi dung nhap.

## 6.4 Convergence Log (Bieu do hoi tu)

GA va SA tra ve convergence log de ve bieu do:
- **GA**: [{generation: 0, cost: 2500}, {generation: 1, cost: 2200}, ...]
- **SA**: [{iteration: 0, cost: 1800}, {iteration: 100, cost: 1200}, ...]

Frontend (Recharts) ve bieu do nay de nguoi dung thay qua trinh hoi tu.

## 6.5 Nhan xet chung ve hieu qua

Dua tren cau truc giai thuat:

| Giai thuat | Toc do | Chat luong | Phu hop voi |
|------------|--------|------------|-------------|
| GA | Cham (200 the he x 100 ca the) | Tot (global search) | Bai toan lon, nhieu rang buoc |
| Hill Climbing | Trung binh | Trung binh (local optimum) | Bai toan nho, can ket qua nhanh |
| SA | Nhanh (10000 buoc don) | Kha tot (co the thoat local) | Can can bang toc do/chat luong |
| Minimax | Trung binh | Tot trong pham vi tim kiem | Bai toan nho, can deterministic |


---

# 7. XAY DUNG GIAI PHAP BAI TOAN

## 7.1 Luong xu ly chinh (POST /api/schedule)

### Buoc 1: Nhan va chuan hoa dau vao
- Nhan ScheduleInput: danh sach mon hoc, rang buoc, giai thuat
- Chuan hoa ngay hoc (T2/Thu2/Monday -> T2)
- Tinh priority cho tung mon (co them +2 neu la mon hoc lai)

### Buoc 2: Phat hien va xu ly xung dot thoi gian
He thong kiem tra xung dot giua cac mon:
- Hai mon trung khoang thoi gian (ngay hoc + gio hoc)
- Neu trung: giu mon co priority cao hon
- **Tu dong tim session thay the tu database** (neu co)
  - Tim cac nhom/lop khac cua cung mon hoc
  - Kiem tra nhom thay the khong trung voi cac mon con lai
  - Neu tim duoc: thay the tu dong (khong loai mon)
  - Neu khong tim duoc: loai mon co priority thap hon

### Buoc 3: Chuan bi dau vao cho giai thuat
- Tao danh sach time_slots: available_slots + unavailable_slots
- Tao subject_details: thong tin chi tiet tung mon
- Tao additional_constraints_dict: cac rang buoc bo sung

### Buoc 4: Chay giai thuat toi uu hoa
Goi _run_scheduler_algorithm() voi giai thuat duoc chon:
- "ga" -> Genetic Algorithm
- "hill_climbing" -> Hill Climbing
- "sa" -> Simulated Annealing
- "minimax" -> Minimax

### Buoc 5: Dinh dang ket qua
- Chuyen individual (list[int]) thanh lich hoc co the doc duoc
- Them thong tin: giang vien, ngay bat dau/ket thuc, gio hoc
- Tao convergence log (neu co)

### Buoc 6: Luu va tra ve
- Luu lich vao MongoDB (neu persist_schedule=True)
- Tra ve JSON: schedule, cost, removed_conflicts, alternative_sessions, convergence

## 7.2 Xu ly xung dot thong minh

Day la tinh nang dac biet cua he thong:

`
Mon A (priority 7) va Mon B (priority 4) trung gio
  -> Giu Mon A
  -> Tim session thay the cho Mon B trong database
     -> Tim thay nhom B2 cua Mon B khong trung gio
     -> Thay the Mon B bang Mon B2 (tu dong)
     -> Ghi nhan: "Da chuyen sang nhom B2 de tranh trung voi Mon A"
  -> Neu khong tim thay: loai Mon B, ghi nhan vao removed_conflicts
`

## 7.3 Cau truc du lieu ScheduleInput

`python
class ScheduleInput:
    subjects: List[SubjectInput]     # Danh sach mon hoc
    available_time_slots: List[str]  # Cac slot kha dung
    constraints: Dict[str, List[str]] # Rang buoc cam (mon -> [slot cam])
    additionalConstraints: AdditionalConstraints
    algorithm: str                   # "ga" | "hill_climbing" | "sa" | "minimax"
    persist_schedule: bool           # Co luu vao DB khong

class SubjectInput:
    name: str          # Ten mon hoc
    start_time: str    # Gio bat dau (VD: "07:30")
    end_time: str      # Gio ket thuc (VD: "09:15")
    credits: int       # So tin chi
    subject_type: str  # "Ly thuyet" | "Thuc hanh"
    instructor: str    # Ten giang vien
    start_date: str    # Ngay bat dau (YYYY-MM-DD)
    end_date: str      # Ngay ket thuc (YYYY-MM-DD)
    day: str           # Ngay hoc (VD: "T2")
    priority: int      # Do uu tien 1-10
    is_retake: bool    # Mon hoc lai
    preferred_days: List[str]  # Ngay hoc yeu thich
`


---

# 8. HIEN THI KET QUA VA DANH GIA, SO SANH

## 8.1 Ket qua tra ve tu API

### Ket qua xep lich don (POST /api/schedule)
`json
{
  "schedule": [
    {
      "subject": "Toan cao cap",
      "time": "T2_Sang",
      "instructor": "GV Nguyen Van A",
      "sessions": 1,
      "start_date": "2024-09-02",
      "end_date": "2024-12-20",
      "start_time": "07:30",
      "end_time": "09:15",
      "priority": 8,
      "is_retake": false
    }
  ],
  "cost": 450.0,
  "removed_conflicts": [
    {
      "subject": "Mon bi loai",
      "kept_with": "Mon duoc giu",
      "reason": "Trung thoi gian"
    }
  ],
  "alternative_sessions": [
    {
      "original": "Vat ly A1 - Nhom 1",
      "alternative": "Vat ly A1 - Nhom 3",
      "reason": "Da tu dong chuyen sang nhom khac"
    }
  ],
  "convergence": [
    {"x": 0, "cost": 2500},
    {"x": 50, "cost": 1200},
    {"x": 100, "cost": 600},
    {"x": 150, "cost": 450}
  ]
}
`

## 8.2 Ket qua so sanh giai thuat (POST /api/schedule/compare)

Frontend hien thi bang so sanh:

| Giai thuat | Chi phi (Cost) | Thoi gian (ms) | Mon bi loai |
|------------|---------------|----------------|-------------|
| GA | 450 | 3200 | 0 |
| Hill Climbing | 600 | 1800 | 0 |
| SA | 380 | 850 | 0 |
| Minimax | 520 | 2100 | 0 |
| **Tot nhat** | **SA (380)** | | |

## 8.3 Bieu do hoi tu (Convergence Chart)

Frontend dung Recharts ve bieu do duong (line chart):
- Truc X: The he (GA) hoac Buoc lap (SA)
- Truc Y: Chi phi (penalty score)
- Duong di xuong = giai thuat dang hoi tu tot

Vi du GA: 2500 -> 1800 -> 1200 -> 800 -> 450 (qua 200 the he)
Vi du SA: 1800 -> 1400 -> 900 -> 380 (qua 10000 buoc)

## 8.4 Ket qua Benchmark (POST /api/schedule/benchmark)

Chay tren 5 bo du lieu chuan, ket qua mau:

| Bo du lieu | GA Cost | HC Cost | SA Cost | MM Cost | Tot nhat |
|------------|---------|---------|---------|---------|----------|
| Nho (3 mon) | 0 | 0 | 0 | 0 | GA/HC/SA/MM |
| Vua (5 mon) | 200 | 400 | 150 | 300 | SA |
| Trung binh (7 mon) | 450 | 700 | 380 | 520 | SA |
| Lon (10 mon) | 800 | 1200 | 650 | 900 | SA |
| Rat lon (12 mon) | 1100 | 1800 | 950 | 1300 | SA |

*Luu y: Ket qua thuc te co the khac do tinh ngau nhien cua GA va SA*

## 8.5 Xuat ket qua

Nguoi dung co the xuat lich hoc ra:
- **PDF**: dung jsPDF + jspdf-autotable
- **Excel**: dung xlsx library
- **In truc tiep**: tu trinh duyet


---

# 9. KE HOACH CAI TIEN AI (AI ALGORITHM IMPROVEMENTS)

## 9.1 Tong quan

Day la ke hoach nang cap toan dien phan thuat toan AI cua Smart Scheduler, duoc mo ta trong spec .kiro/specs/ai-algorithm-improvements/.

## 9.2 Cac cai tien cho GA

### 9.2.1 Crossover da dang hon
Hien tai chi co single-point crossover. Se bo sung:

**Order Crossover (OX)**:
1. Chon doan con ngau nhien tu parent1
2. Giu nguyen doan do trong child
3. Dien cac vi tri con lai theo thu tu xuat hien trong parent2
- Uu diem: bao toan cau truc tuong doi cua parent1

**Uniform Crossover**:
- Moi gen duoc chon tu parent1 hoac parent2 voi xac suat 0.5
- Uu diem: da dang hon, khong phu thuoc vi tri

### 9.2.2 Adaptive Mutation Rate
Hien tai ty le dot bien co dinh 10%. Se nang cap:
- Theo doi stagnation_counter (so the he khong cai thien)
- Khi bi ket (stagnation > 20): tang mutation rate len (toi da 50%)
- Khi co cai thien: giam ve base_mutation_rate (10%)
- Muc dich: tu dong thoat khoi local optimum

### 9.2.3 Constraint Repair
Sau dot bien, tu dong sua xung dot slot:
- Phat hien 2 mon trung slot
- Tim slot gan nhat khong bi xung dot
- Sua truoc khi dua vao quan the moi
- Muc dich: tang chat luong quan the, giam penalty nhanh hon

### 9.2.4 Early Stopping
Dung som khi khong con cai thien:
- Tham so early_stopping_patience = 30 the he
- Neu 30 the he lien tiep khong cai thien: dung
- Ghi nhan vao convergence log: stopped_early: true
- Muc dich: tiet kiem thoi gian tinh toan

## 9.3 Cac cai tien cho SA

### 9.3.1 Adaptive Cooling Schedule
Hien tai lam nguoi co dinh (T = T * 0.995). Se nang cap:
- Theo doi acceptance_rate trong 100 buoc gan nhat
- Neu acceptance_rate cao (> 0.4): lam nguoi nhanh hon (alpha_fast = 0.99)
- Neu acceptance_rate thap (< 0.4): lam nguoi cham hon (alpha_slow = 0.999)
- Muc dich: can bang exploration/exploitation tu dong

### 9.3.2 Swap Neighbor
Hien tai chi thay doi 1 gen. Se bo sung:
- Swap neighbor: hoan doi slot cua 2 mon ngau nhien
- Mixed strategy: chon ngau nhien giua single_gene va swap
- Muc dich: kham pha khong gian tim kiem da dang hon

## 9.4 Thuat toan moi: Tabu Search

**Nguon goc**: Tabu Search (Fred Glover, 1986) la giai thuat local search nang cao.

**Y tuong chinh**: Duy tri danh sach "tabu" cac trang thai da tham, cam quay lai de tranh cycling.

**Quy trinh**:
1. Khoi tao nghiem ngau nhien
2. Moi buoc: danh gia TAT CA single-gene moves
3. Chon move tot nhat KHONG co trong tabu list
4. Aspiration criterion: cho phep tabu move neu no vuot qua global best
5. Neu tat ca moves deu tabu: chon move co cost thap nhat trong tabu
6. Them move vua thuc hien vao tabu list (FIFO, max = tenure)
7. Lap lai max_iter buoc

**Tham so**: tenure=10, max_iter=1000

**Uu diem so voi Hill Climbing**:
- Tranh quay lai trang thai da tham
- Co the thoat khoi local optimum
- Bao dam kham pha nhieu vung khac nhau

## 9.5 Thuat toan moi: Hybrid GA+SA

**Y tuong**: Ket hop GA (global search) voi SA (local search) de tan dung uu diem ca hai.

**Quy trinh**:
1. Chay GA trong ga_generations the he (mac dinh: 100)
2. Moi sa_interval the he (mac dinh: 20): lay top_k ca the tot nhat (mac dinh: 5)
3. Chay SA local search tren moi ca the trong top_k (sa_max_iter=500 buoc)
4. Neu SA tim duoc nghiem tot hon: thay the ca the trong quan the GA
5. Tiep tuc GA tu quan the da duoc cai thien
6. Tra ve nghiem tot nhat + convergence log day du

**Uu diem**:
- GA kham pha toan cuc, SA tinh chinh cuc bo
- Ket qua tot hon chay rieng le tung giai thuat
- Convergence log ghi nhan ca 2 pha (ga va sa)

## 9.6 Tien xu ly AC-3 (Constraint Propagation)

**Nguon goc**: AC-3 (Arc Consistency Algorithm 3) la thuat toan lan truyen rang buoc.

**Ap dung vao bai toan**:
- Moi mon hoc co mot "domain" = tap cac slot hop le
- AC-3 loai bo cac slot vi pham rang buoc cung (hard constraints) truoc khi chay giai thuat
- Ket qua: reduced_domains - moi mon chi con cac slot thuc su hop le

**Quy trinh**:
1. Moi mon: domain = tat ca slot (0 den num_slots-1)
2. Loai bo cac slot nam trong constraints[mon] (slot bi cam)
3. Neu domain rong: phuc hoi domain day du + canh bao
4. Tra ve reduced_domains

**Loi ich**:
- Giam khong gian tim kiem cho tat ca giai thuat
- Giai thuat khong bao gio xep mon vao slot bi cam
- Hoi tu nhanh hon

## 9.7 PenaltyConfig - Cau hinh penalty qua API

Hien tai cac he so penalty la magic numbers hardcode. Se nang cap:

`python
class PenaltyConfig:
    slot_collision_high: float = 1000    # Phat trung slot (mon priority cao)
    slot_collision_low: float = 1500     # Phat trung slot (mon priority thap)
    forbidden_slot_base: float = 500     # Phat slot bi cam
    unavailable_slot_base: float = 800   # Phat slot khong kha dung
    consecutive_day_penalty: float = 200 # Phat mon lien tiep
    day_imbalance_factor: float = 50     # He so can bang ngay
    afternoon_penalty: float = 100       # Phat buoi chieu
    saturday_penalty: float = 300        # Phat T7
    triple_consecutive_penalty: float = 300  # Phat 3 buoi lien tiep
    instructor_conflict_penalty: float = 800 # Phat giang vien trung gio
`

Nguoi dung co the truyen PenaltyConfig qua API de dieu chinh hanh vi xep lich.

## 9.8 Rang buoc moi trong Fitness Function

### Rang buoc 8: Tranh 3 buoi lien tiep trong ngay
Khi 3 mon duoc xep vao Sang+Chieu+Toi cung ngay: +300 penalty moi nhom

### Rang buoc 9: Xung dot giang vien
Khi 2 mon cung giang vien duoc xep cung slot: +800 penalty moi cap


---

# 10. CAU TRUC DU AN

## 10.1 Thu muc goc

`
Tr-tu-nh-n-t-o/
  smart-scheduler-api/     Backend Python/FastAPI
  smart-scheduler-ui/      Frontend React
  docs/                    Tai lieu
  .kiro/specs/             Spec files (requirements, design, tasks)
  README.md
`

## 10.2 Backend chi tiet

`
smart-scheduler-api/
  main.py                  Entry point, tat ca API endpoints
  schemas.py               Pydantic data models
  requirements.txt         Python dependencies
  .env                     Bien moi truong (MONGODB_URL)
  
  auth/
    security.py            JWT, bcrypt, OAuth2
  
  db/
    database.py            Ket noi MongoDB
    models.py              Beanie Document models
  
  genetic_algorithm/
    base.py                BaseScheduler (lop co so)
    fitness.py             Ham danh gia fitness
    scheduler_ga.py        Genetic Algorithm
    simulated_annealing.py Simulated Annealing
    hill_climbing.py       Hill Climbing
    minimax_scheduler.py   Minimax + Alpha-Beta
  
  scripts/
    add_sample_courses.py  Them mon hoc mau
    clear_courses.py       Xoa mon hoc
    reset_courses.py       Reset du lieu
`

## 10.3 Frontend chi tiet

`
smart-scheduler-ui/
  public/
    index.html
    samples/courses_sample.csv  File mau upload mon hoc
  
  src/
    App.js                 Router chinh
    index.js               Entry point React
    
    pages/
      AuthPage.js          Dang nhap / Dang ky
      HomePage.js          Trang chu
      SchedulerPage.js     Trang xep lich chinh
      AdminPage.js         Quan tri vien
      ProblemFormulationPage.js  Mo ta bai toan
    
    components/
      ProtectedRoute.js    Bao ve route can dang nhap
      AdminRoute.js        Bao ve route can quyen admin
    
    context/
      AuthContext.js       Quan ly trang thai auth
    
    services/
      api.js               Axios HTTP client
    
    utils/
      exportSchedule.js    Xuat PDF/Excel
`

## 10.4 Spec files (.kiro/specs/ai-algorithm-improvements/)

`
requirements.md   14 yeu cau chuc nang chi tiet
design.md         Thiet ke ky thuat: kien truc, interface, 22 correctness properties
tasks.md          16 nhiem vu trien khai (46 sub-tasks)
.config.kiro      Cau hinh spec (feature, requirements-first)
`

---

# 11. CONG NGHE SU DUNG

## 11.1 Backend

| Cong nghe | Phien ban | Muc dich |
|-----------|-----------|----------|
| Python | 3.8+ | Ngon ngu lap trinh chinh |
| FastAPI | >=0.104.0 | Web framework, REST API |
| Uvicorn | >=0.24.0 | ASGI server |
| Beanie | >=1.23.0 | MongoDB ODM (Object Document Mapper) |
| Motor | >=3.3.0 | Async MongoDB driver |
| Pydantic | >=2.5.0 | Data validation, schemas |
| python-jose | >=3.3.0 | JWT token |
| bcrypt | (qua passlib) | Password hashing |
| pandas | >=2.2.0 | Doc file CSV/Excel |
| openpyxl | >=3.1.2 | Doc file .xlsx |
| pdfplumber | >=0.11.0 | Doc file PDF |
| numpy | >=1.26.0 | Tinh toan so hoc |

## 11.2 Frontend

| Cong nghe | Phien ban | Muc dich |
|-----------|-----------|----------|
| React | ^18.2.0 | UI framework |
| React Router | ^7.9.6 | Dinh tuyen trang |
| Axios | ^1.13.2 | HTTP client |
| Recharts | ^2.15.0 | Ve bieu do (convergence chart) |
| Framer Motion | ^11.18.2 | Animation |
| jsPDF | ^3.0.3 | Xuat PDF |
| jspdf-autotable | ^5.0.2 | Bang trong PDF |
| xlsx | ^0.18.5 | Xuat Excel |

## 11.3 Database

| Cong nghe | Muc dich |
|-----------|----------|
| MongoDB | Co so du lieu NoSQL |
| MongoDB Atlas | Cloud hosting (tuy chon) |

## 11.4 Testing (Ke hoach)

| Cong nghe | Muc dich |
|-----------|----------|
| pytest | Unit testing |
| Hypothesis | Property-based testing (PBT) |

---

# 12. API ENDPOINTS TONG HOP

| Method | Endpoint | Chuc nang | Auth |
|--------|----------|-----------|------|
| POST | /api/register | Dang ky tai khoan | Khong |
| POST | /api/login | Dang nhap, nhan JWT | Khong |
| GET | /api/users/me | Thong tin user hien tai | User |
| POST | /api/schedule | Xep lich toi uu | User |
| POST | /api/schedule/compare | So sanh 4 giai thuat | User |
| POST | /api/schedule/benchmark | Benchmark 5 bo du lieu | User |
| GET | /api/courses | Danh sach mon hoc | User |
| GET | /api/courses/{code}/sessions | Cac nhom cua 1 mon | User |
| GET | /api/metadata/semesters | Danh sach hoc ky | User |
| GET | /api/metadata/majors | Danh sach chuyen nganh | User |
| POST | /api/admin/upload-courses | Upload mon hoc (CSV/Excel/PDF) | Admin |
| POST | /api/admin/courses | Them mon hoc thu cong | Admin |
| GET | /api/admin/courses/export | Xuat mon hoc ra CSV | Admin |
| DELETE | /api/admin/courses | Xoa nhieu mon hoc | Admin |
| DELETE | /api/admin/courses/{id} | Xoa 1 mon hoc | Admin |
| GET | /api/admin/users | Danh sach nguoi dung | Admin |
| DELETE | /api/admin/users/{id} | Xoa nguoi dung | Admin |
| PATCH | /api/admin/users/{id}/toggle-admin | Cap/thu hoi quyen admin | Admin |
| POST | /api/forgot-password/request | Gui OTP qua email/SMS | Khong |
| POST | /api/forgot-password/verify | Xac nhan OTP | Khong |
| POST | /api/forgot-password/reset | Dat lai mat khau | Khong |

---

# 13. TONG KET

## 13.1 Nhung gi da lam duoc

1. **He thong xep lich hoan chinh**: 4 giai thuat toi uu hoa, xu ly xung dot, tim session thay the
2. **API day du**: authentication, quan ly mon hoc, xep lich, so sanh, benchmark
3. **Giao dien web**: nhap lieu, hien thi ket qua, bieu do hoi tu, xuat PDF/Excel
4. **Quan tri**: quan ly mon hoc (upload CSV/Excel/PDF), quan ly nguoi dung
5. **Bao mat**: JWT, bcrypt, OTP quen mat khau

## 13.2 Ke hoach cai tien (AI Algorithm Improvements)

1. **GA**: OX crossover, uniform crossover, adaptive mutation, constraint repair, early stopping
2. **SA**: adaptive cooling, swap neighbor
3. **Moi**: Tabu Search, Hybrid GA+SA
4. **Tien xu ly**: AC-3 constraint propagation
5. **Fitness**: triple-consecutive penalty, instructor conflict penalty, PenaltyConfig
6. **Testing**: 22 correctness properties, property-based testing voi Hypothesis

## 13.3 Gia tri khoa hoc

- So sanh 4 (se la 6) giai thuat metaheuristic tren cung bai toan
- Convergence analysis qua bieu do hoi tu
- Benchmark tren bo du lieu chuan (fixed seed)
- Property-based testing dam bao tinh dung dan cua giai thuat
- Cau truc code sach: single source of truth cho fitness function

---

*File nay duoc tao tu dong bang cach doc toan bo source code du an.*
*Ngay tao: 14/05/2026 15:08*
