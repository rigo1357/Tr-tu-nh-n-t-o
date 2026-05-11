import React from 'react';
import { Link } from 'react-router-dom';
import './ProblemFormulationPage.css';

function ProblemFormulationPage() {
  return (
    <div className="problem-page">
      <nav className="problem-nav">
        <Link to="/" className="problem-nav-link">Trang chủ</Link>
        <Link to="/login" className="problem-nav-link">Đăng nhập</Link>
      </nav>

      <main className="problem-main">
        <h1 className="problem-title">Mô tả hình thức bài toán xếp lịch học</h1>
        <p className="problem-lead">
          Tài liệu tóm tắt biểu diễn trạng thái, hàm chi phí dùng trong hệ thống Smart Scheduler và các chiến lược tìm kiếm đã triển khai.
        </p>

        <section className="problem-section">
          <h2>1. Biểu diễn bài toán (Problem Representation)</h2>
          <div className="problem-pre-block">
            <p>Không gian trạng thái: vector <strong>S = [s₁, s₂, …, sₙ]</strong></p>
            <ul>
              <li><em>n</em> = số môn học được chọn (sau khi xử lý trùng lịch).</li>
              <li><em>sᵢ</em> thuộc tập chỉ số slot 0 … K−1 (số nguyên) — gán môn <em>i</em> vào một slot cụ thể.</li>
              <li><em>K</em> = tổng số slot khả dụng trong mã hóa (thứ trong tuần × buổi: Sáng / Chiều / Tối, cộng thêm các slot ngoài tập rảnh để tính phạt).</li>
            </ul>
            <p>Trạng thái ban đầu: gán ngẫu nhiên hoặc khởi tạo theo luật đơn giản của từng thuật toán.</p>
            <p>Trạng thái mục tiêu: <strong>S* = argmin cost(S)</strong> (tối thiểu hóa tổng penalty theo <code>fitness.py</code>).</p>
          </div>
        </section>

        <section className="problem-section">
          <h2>2. Hàm chi phí (Cost Function)</h2>
          <p className="problem-note">
            Các hệ số dưới đây khớp với mã nguồn <code>smart-scheduler-api/genetic_algorithm/fitness.py</code> (một nguồn duy nhất cho mọi thuật toán).
          </p>
          <div className="problem-table-wrap">
            <table className="problem-table">
              <thead>
                <tr>
                  <th>Loại</th>
                  <th>Mô tả</th>
                  <th>Penalty / hiệu ứng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cứng (Hard)</td>
                  <td>Hai môn cùng một slot (trùng chỉ số slot)</td>
                  <td>+1000 hoặc +1500 (tùy độ ưu tiên môn so với môn đã chiếm slot)</td>
                </tr>
                <tr>
                  <td>Cứng (Hard)</td>
                  <td>Môn rơi vào slot nằm trong danh sách cấm của chính môn đó (<code>constraints</code>)</td>
                  <td>+500 − (priority − 5) × 50</td>
                </tr>
                <tr>
                  <td>Mềm (Soft)</td>
                  <td>Bật &quot;Tránh môn liên tiếp&quot; — hai môn kề nhau trong danh sách cùng ngày</td>
                  <td>+200</td>
                </tr>
                <tr>
                  <td>Mềm (Soft)</td>
                  <td>Bật &quot;Cân bằng ngày&quot; — chênh lệch số môn giữa ngày nhiều nhất và ít nhất</td>
                  <td>(max − min) × 50</td>
                </tr>
                <tr>
                  <td>Mềm (Soft)</td>
                  <td>Bật &quot;Ưu tiên buổi sáng&quot; — môn xếp vào buổi Chiều</td>
                  <td>+100 mỗi slot Chiều</td>
                </tr>
                <tr>
                  <td>Mềm (Soft)</td>
                  <td>Không cho phép thứ 7 — môn rơi slot thứ 7</td>
                  <td>+300</td>
                </tr>
                <tr>
                  <td>Mềm (Soft)</td>
                  <td>Slot ngoài tập thời gian rảnh (<code>unavailable_slots</code>)</td>
                  <td>+800 − (priority − 5) × 50</td>
                </tr>
                <tr>
                  <td>Mềm (Soft)</td>
                  <td>Môn tối (slot có chữ &quot;Tối&quot;) với môn không phải học lại</td>
                  <td>+80</td>
                </tr>
                <tr>
                  <td>Ưu đãi</td>
                  <td>Ngày học thuộc <code>preferred_days</code> của môn</td>
                  <td>−150 (giảm cost)</td>
                </tr>
                <tr>
                  <td>Ưu đãi</td>
                  <td>Môn học lại xếp buổi Sáng</td>
                  <td>−20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="problem-section">
          <h2>3. Chiến lược tìm kiếm (Search Strategy)</h2>
          <div className="problem-table-wrap">
            <table className="problem-table">
              <thead>
                <tr>
                  <th>Thuật toán</th>
                  <th>Loại</th>
                  <th>Thoát local optimum</th>
                  <th>Độ phức tạp (ước lượng)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Genetic Algorithm</td>
                  <td>Population-based</td>
                  <td>Có (lai ghép + đột biến)</td>
                  <td>O(P × G × N)</td>
                </tr>
                <tr>
                  <td>Hill Climbing</td>
                  <td>Local search</td>
                  <td>Hạn chế (random restart trong triển khai)</td>
                  <td>O(R × I × N × K)</td>
                </tr>
                <tr>
                  <td>Simulated Annealing</td>
                  <td>Stochastic search</td>
                  <td>Có (chấp nhận xấu hơn theo xác suất)</td>
                  <td>O(I × N)</td>
                </tr>
                <tr>
                  <td>Minimax + Alpha-Beta</td>
                  <td>Adversarial search</td>
                  <td>Không áp dụng theo nghĩa tối ưu liên tục (mô hình đối thủ)</td>
                  <td>O(K^min(N, 6)) (giới hạn độ sâu trong triển khai)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProblemFormulationPage;
