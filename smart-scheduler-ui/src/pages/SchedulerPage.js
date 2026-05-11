// src/pages/SchedulerPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { exportToPDF, exportToExcel } from '../utils/exportSchedule';
import './SchedulerPage.css';

const defaultStudyInfo = {
  semester: '',
  major: '',
  maxCredits: '',
  minCredits: '',
};

const defaultFreeTime = {
  T2: { morning: false, afternoon: false, evening: false },
  T3: { morning: false, afternoon: false, evening: false },
  T4: { morning: false, afternoon: false, evening: false },
  T5: { morning: false, afternoon: false, evening: false },
  T6: { morning: false, afternoon: false, evening: false },
  T7: { morning: false, afternoon: false, evening: false },
  CN: { morning: false, afternoon: false, evening: false },
};

const dayTitle = {
  T2: 'Thứ 2', T3: 'Thứ 3', T4: 'Thứ 4',
  T5: 'Thứ 5', T6: 'Thứ 6', T7: 'Thứ 7', CN: 'Chủ nhật',
};

const algoLabel = {
  ga: 'Genetic Algorithm',
  hill_climbing: 'Hill Climbing',
  sa: 'Simulated Annealing',
  minimax: 'Minimax + Alpha-Beta'
};

const algoLabelVi = {
  ga: 'Thuật toán di truyền (GA)',
  hill_climbing: 'Leo đồi (Hill Climbing)',
  sa: 'Luyện kim mô phỏng (SA)',
  minimax: 'Minimax + Alpha-Beta'
};

function SectionDivider({ title }) {
  return (
    <div className="section-divider" style={{ margin: '40px 0 24px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          height: '3px',
          flex: 1,
          background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.3), transparent)',
          borderRadius: '2px'
        }}></div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          margin: 0,
          color: '#0c4a6e',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap'
        }}>{title}</h3>
        <div style={{
          height: '3px',
          flex: 1,
          background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.3), transparent)',
          borderRadius: '2px'
        }}></div>
      </div>
    </div>
  );
}

function ConstraintToggle({ label, checked, onChange }) {
  return (
    <label className="constraint-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function SchedulerForm({ onGenerate }) {
  const [studyInfo, setStudyInfo] = useState(defaultStudyInfo);
  const [freeTime, setFreeTime] = useState(defaultFreeTime);
  const [constraints, setConstraints] = useState({
    avoidConsecutive: true, balanceDays: true, preferMorning: false, allowSaturday: false,
  });
  const [algorithm, setAlgorithm] = useState('ga');
  const [selectedTab, setSelectedTab] = useState('current');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableMajors, setAvailableMajors] = useState([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [metadataError, setMetadataError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      setIsLoadingMetadata(true);
      setMetadataError(null);
      try {
        console.log('Đang tải metadata từ API...');
        const [semRes, majRes] = await Promise.all([
          api.get('/api/metadata/semesters'),
          api.get('/api/metadata/majors')
        ]);

        const semesters = semRes.data?.semesters || [];
        const majors = majRes.data?.majors || [];

        console.log('Đã tải metadata:', { semesters, majors });

        setAvailableSemesters(semesters);
        setAvailableMajors(majors);

        if (semesters.length === 0) {
          console.warn('⚠️ Không có dữ liệu học kỳ trong database. Hãy chạy script add_sample_courses.py để thêm dữ liệu mẫu.');
        }
        if (majors.length === 0) {
          console.warn('⚠️ Không có dữ liệu chuyên ngành trong database.');
        }
      } catch (err) {
        console.error('❌ Lỗi tải metadata:', err);
        setMetadataError(err.response?.data?.detail || err.message || 'Không thể tải dữ liệu từ server');
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      // Chỉ load khi có học kỳ
      if (!studyInfo.semester) {
        setAvailableSubjects([]);
        return;
      }

      setIsLoadingCourses(true);
      try {
        const params = { semester: studyInfo.semester };
        // Thêm filter theo chuyên ngành nếu có
        if (studyInfo.major && studyInfo.major.trim()) {
          params.major = studyInfo.major.trim();
        }

        const response = await api.get('/api/courses', { params });
        if (!isMounted) return;
        setAvailableSubjects(response.data?.items || []);
        setCoursesError(null);
      } catch (error) {
        console.error('Lỗi tải môn học:', error);
        if (isMounted) setCoursesError('Không thể tải danh sách môn học.');
      } finally {
        if (isMounted) setIsLoadingCourses(false);
      }
    };
    loadCourses();
    return () => { isMounted = false; };
  }, [studyInfo.semester, studyInfo.major]);

  const handleStudyFieldChange = (field, value) => setStudyInfo(prev => ({ ...prev, [field]: value }));

  const handleMaxCreditsChange = (value) => {
    if (value === '') {
      setStudyInfo(prev => ({ ...prev, maxCredits: '', minCredits: '' }));
      return;
    }
    const numeric = parseInt(value, 10);
    if (Number.isNaN(numeric) || numeric < 0) return;
    setStudyInfo(prev => ({ ...prev, maxCredits: numeric, minCredits: Math.floor((numeric * 2) / 3) }));
  };

  const calculatePriority = (subject, index) => {
    const base = Math.max(1, 10 - index);
    return Math.min(10, base + (subject.is_retake ? 2 : 0));
  };

  const moveSubject = (index, direction) => {
    setSelectedSubjects(prev => {
      const newList = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newList.length) return prev;
      const [removed] = newList.splice(index, 1);
      newList.splice(targetIndex, 0, removed);
      return newList;
    });
  };

  const handleFreeTimeChange = (day, period) => {
    setFreeTime(prev => ({ ...prev, [day]: { ...prev[day], [period]: !prev[day][period] } }));
  };

  const buildSubjectPayload = (course, sessionData = null) => {
    // Nếu có sessionData (từ API), dùng dữ liệu từ đó
    if (sessionData) {
      return {
        code: sessionData.code,
        displayName: sessionData.name,
        name: `${sessionData.code} - ${sessionData.name}`,
        credits: sessionData.credits || 3,
        instructor: sessionData.department || '',
        start_time: sessionData.start_time || '07:00',
        end_time: sessionData.end_time || '11:30',
        start_date: sessionData.start_date || new Date().toISOString().split('T')[0],
        end_date: sessionData.end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        day: sessionData.day || course?.metadata?.day || null,
        subject_type: 'Lý thuyết',
      };
    }

    // Fallback: tạo từ course thông thường
    const today = new Date();
    const endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    return {
      code: course.code,
      displayName: course.name,
      name: `${course.code} - ${course.name}`,
      credits: course.credits || 3,
      instructor: course.department || '',
      start_time: '07:00',
      end_time: '11:30',
      start_date: today.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      day: course.metadata?.day || null,
      subject_type: 'Lý thuyết',
    };
  };

  const handleSubjectToggle = async (course) => {
    // Lấy original_code (nếu là session có -G thì lấy phần trước -G)
    const originalCode = course.metadata?.original_code ||
      (course.code.includes('-G') ? course.code.split('-G')[0] : course.code);

    // Kiểm tra xem đã có môn học này chưa (so sánh theo original_code hoặc code trực tiếp)
    const existing = selectedSubjects.find(item => {
      const itemOriginalCode = item.code.includes('-G') ? item.code.split('-G')[0] : item.code;
      // So sánh cả originalCode và code trực tiếp để đảm bảo tìm được
      return itemOriginalCode === originalCode || item.code === course.code || item.code === originalCode;
    });

    if (existing) {
      // Xóa môn học này (so sánh theo originalCode hoặc code trực tiếp)
      setSelectedSubjects(prev => prev.filter(item => {
        const itemOriginalCode = item.code.includes('-G') ? item.code.split('-G')[0] : item.code;
        // Giữ lại những môn không khớp với originalCode hoặc course.code
        return itemOriginalCode !== originalCode && item.code !== course.code && item.code !== originalCode;
      }));
      return;
    }

    // Lấy chỉ session đầu tiên từ API
    try {
      const response = await api.get(`/api/courses/${originalCode}/sessions`, {
        params: { semester: studyInfo.semester }
      });

      const sessions = response.data?.sessions || [];
      const isRetake = selectedTab === 'retake';

      if (sessions.length > 0) {
        // Chỉ lấy session đầu tiên
        const firstSession = sessions[0];
        setSelectedSubjects(prev => [...prev, {
          ...buildSubjectPayload(course, firstSession),
          is_retake: isRetake,
        }]);
      } else {
        // Nếu không có sessions, thêm môn học thông thường
        setSelectedSubjects(prev => [...prev, {
          ...buildSubjectPayload(course),
          is_retake: isRetake
        }]);
      }
    } catch (error) {
      console.error('Lỗi lấy sessions:', error);
      // Fallback: chỉ thêm môn học hiện tại
      const isRetake = selectedTab === 'retake';
      setSelectedSubjects(prev => [...prev, {
        ...buildSubjectPayload(course),
        is_retake: isRetake
      }]);
    }
  };

  // Tạo danh sách các originalCode đã được chọn để kiểm tra
  const selectedOriginalCodes = selectedSubjects.map(s => {
    const code = s.code.includes('-G') ? s.code.split('-G')[0] : s.code;
    return code;
  });

  const filteredSubjects = availableSubjects.filter(c => {
    if (!searchText) return true;
    return `${c.code} ${c.name}`.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleGenerate = () => {
    if (selectedSubjects.length === 0) {
      alert('Vui lòng chọn ít nhất một môn học!');
      return;
    }
    const availableSlots = [];
    const slotMap = { morning: 'Sáng', afternoon: 'Chiều', evening: 'Tối' };
    Object.keys(freeTime).forEach(day => {
      Object.entries(slotMap).forEach(([key, label]) => {
        if (freeTime[day]?.[key]) availableSlots.push(`${day}_${label}`);
      });
    });

    const subjectsWithPriority = selectedSubjects.map((subject, index) => ({
      ...subject, priority: calculatePriority(subject, index),
    }));

    onGenerate({
      studyInfo, subjects: subjectsWithPriority, availableSlots,
      constraints: {}, additionalConstraints: constraints,
      algorithm,
    });
  };

  return (
    <div className="scheduler-main-card">
      <h2 style={{ marginTop: 0, marginBottom: '32px' }}>Thông tin học tập</h2>
      <div style={{ marginBottom: '18px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Thuật toán tối ưu</label>
        <select className="form-input" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="ga">Genetic Algorithm</option>
          <option value="hill_climbing">Hill Climbing</option>
          <option value="sa">Simulated Annealing</option>
          <option value="minimax">Minimax + Alpha-Beta</option>
        </select>
        {algorithm === 'minimax' && selectedSubjects.length > 6 && (
          <div className="algo-warning">
            ⚠️ Minimax hoạt động tốt nhất với ≤ 6 môn học.
            Với {selectedSubjects.length} môn, thời gian chạy có thể rất lâu.
            Gợi ý: dùng GA hoặc SA để có kết quả nhanh hơn.
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '24px', marginBottom: '16px' }}>
        <div className="form-field-wrapper">
          <label>Học kỳ *</label>
          {isLoadingMetadata ? (
            <div className="form-input" style={{ color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="loading-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(148, 163, 184, 0.3)', borderTopColor: '#22d3ee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
              Đang tải...
            </div>
          ) : metadataError ? (
            <div className="form-input" style={{ color: '#f87171', borderColor: '#f87171', background: 'rgba(248, 113, 113, 0.1)' }}>
              ⚠️ Lỗi: {metadataError}
            </div>
          ) : (
            <select
              className="form-input"
              value={studyInfo.semester}
              onChange={(e) => handleStudyFieldChange('semester', e.target.value)}
              required
            >
              <option value="">-- Chọn học kỳ --</option>
              {availableSemesters.length === 0 ? (
                <option value="" disabled>Không có dữ liệu</option>
              ) : (
                availableSemesters.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))
              )}
            </select>
          )}
          {availableSemesters.length === 0 && !isLoadingMetadata && !metadataError && (
            <div style={{ fontSize: '12px', color: '#fbbf24', marginTop: '8px', padding: '8px 12px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              ⚠️ Chưa có dữ liệu. Vui lòng upload môn học hoặc chạy script add_sample_courses.py
            </div>
          )}
        </div>
        <div className="form-field-wrapper">
          <label>Chuyên ngành (tuỳ chọn)</label>
          {isLoadingMetadata ? (
            <div className="form-input" style={{ color: '#94a3b8', fontStyle: 'italic' }}>
              Đang tải...
            </div>
          ) : metadataError ? (
            <div className="form-input" style={{ color: '#f87171', borderColor: '#f87171' }}>
              Lỗi: {metadataError}
            </div>
          ) : (
            <select
              className="form-input"
              value={studyInfo.major}
              onChange={(e) => handleStudyFieldChange('major', e.target.value)}
            >
              <option value="">-- Chọn chuyên ngành --</option>
              {availableMajors.length === 0 ? (
                <option value="" disabled>Không có dữ liệu</option>
              ) : (
                availableMajors.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))
              )}
            </select>
          )}
          {availableMajors.length === 0 && !isLoadingMetadata && !metadataError && (
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px', padding: '8px 12px', background: 'rgba(148, 163, 184, 0.1)', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
              Chưa có dữ liệu chuyên ngành
            </div>
          )}
        </div>
        <div className="form-field-wrapper">
          <label>Tín chỉ tối đa *</label>
          <input
            type="number" min="0" className="form-input" placeholder="18"
            value={studyInfo.maxCredits} onChange={(e) => handleMaxCreditsChange(e.target.value)}
          />
        </div>
        <div className="form-field-wrapper">
          <label>Tín chỉ tối thiểu</label>
          <input
            type="number" className="form-input input-readonly" readOnly placeholder="Tự động tính"
            value={studyInfo.minCredits}
          />
        </div>
      </div >

      <SectionDivider title="Thời gian rảnh" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
        {Object.keys(freeTime).map((day) => (
          <div key={day} className="time-card">
            <h4>{dayTitle[day]}</h4>
            <label className="checkbox-label">
              <input type="checkbox" checked={freeTime[day].morning} onChange={() => handleFreeTimeChange(day, 'morning')} />
              <span>Sáng (7:30 - 11:15)</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={freeTime[day].afternoon} onChange={() => handleFreeTimeChange(day, 'afternoon')} />
              <span>Chiều (12:30 - 16:15)</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={freeTime[day].evening} onChange={() => handleFreeTimeChange(day, 'evening')} />
              <span>Tối (17:30 - 21:15)</span>
            </label>
          </div>
        ))}
      </div>

      <SectionDivider title="Chọn môn học" />
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => setSelectedTab('current')} className={`tab-button ${selectedTab === 'current' ? 'active' : 'inactive'}`}>
          Môn học hiện tại
        </button>
        <button onClick={() => setSelectedTab('retake')} className={`tab-button ${selectedTab === 'retake' ? 'active' : 'inactive'}`}>
          Môn học Lại
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
          placeholder="Tìm kiếm mã hoặc tên môn..."
          className="form-input" style={{ borderRadius: '999px' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
        <div className="subject-list-container">
          {isLoadingCourses ? <p>Đang tải danh sách môn học...</p> :
            coursesError ? <p style={{ color: '#f87171' }}>{coursesError}</p> :
              filteredSubjects.length === 0 ? <p style={{ color: '#94a3b8' }}>Không tìm thấy môn học.</p> :
                filteredSubjects.map((course) => {
                  // Kiểm tra xem môn này đã được chọn chưa (so sánh theo originalCode)
                  const courseOriginalCode = course.metadata?.original_code ||
                    (course.code.includes('-G') ? course.code.split('-G')[0] : course.code);
                  const selected = selectedOriginalCodes.includes(courseOriginalCode) ||
                    selectedSubjects.some(s => s.code === course.code);
                  return (
                    <label key={course.code} className={`subject-item-modern ${selected ? 'selected' : 'default'}`}>
                      <div className="subject-info">
                        <div className="subject-code-badge">{course.code}</div>
                        <div className="subject-details">
                          <strong className="subject-name">{course.name}</strong>
                          <div className="subject-meta">
                            <span className="credit-badge">📚 {course.credits || 0} TC</span>
                            {course.department && <span className="dept-badge">🏛️ {course.department}</span>}
                          </div>
                        </div>
                      </div>
                      {selectedTab === 'current' ? (
                        <input type="checkbox" checked={selected} onChange={() => handleSubjectToggle(course)} className="custom-checkbox" />
                      ) : <span className="viewing-badge">👁️ Đang xem</span>}
                    </label>
                  );
                })}
        </div>
        <div style={{ border: '2px solid #e2e8f0', borderRadius: '16px', padding: '20px', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
          <h4 style={{ marginTop: 0, color: '#0c4a6e', fontSize: '1.1rem', fontWeight: 700 }}>Môn đã chọn ({selectedSubjects.length})</h4>
          {(() => {
            const totalCredits = selectedSubjects.reduce((sum, s) => sum + (s.credits || 0), 0);
            const minCredits = studyInfo.minCredits || 0;
            const maxCredits = studyInfo.maxCredits || 0;
            const percentage = minCredits > 0 ? Math.min((totalCredits / minCredits) * 100, 100) : 0;
            const isLow = totalCredits < minCredits;
            const isHigh = maxCredits > 0 && totalCredits > maxCredits;

            return (
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: isLow ? '#fef2f2' : isHigh ? '#fefce8' : '#f0f9ff', borderRadius: '8px', border: `1px solid ${isLow ? '#fecaca' : isHigh ? '#fef08a' : '#bae6fd'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: isLow ? '#991b1b' : isHigh ? '#854d0e' : '#075985' }}>
                    Tổng tín chỉ: {totalCredits} TC
                  </span>
                  {minCredits > 0 && (
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Tối thiểu: {minCredits} TC {maxCredits > 0 && `• Tối đa: ${maxCredits} TC`}
                    </span>
                  )}
                </div>
                {minCredits > 0 && (
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: isLow ? '#f87171' : isHigh ? '#fbbf24' : '#22d3ee',
                      transition: 'width 0.3s ease, background-color 0.3s ease'
                    }} />
                  </div>
                )}
                {isLow && minCredits > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠️ Chưa đủ tín chỉ tối thiểu (thiếu {minCredits - totalCredits} TC)
                  </div>
                )}
                {isHigh && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#ca8a04', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠️ Vượt quá tín chỉ tối đa ({totalCredits - maxCredits} TC)
                  </div>
                )}
              </div>
            );
          })()}
          {selectedSubjects.length === 0 ? <p style={{ color: '#64748b', marginTop: '16px' }}>Chưa chọn môn nào.</p> :
            selectedSubjects.map((subject, index) => (
              <div key={subject.code} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#1e293b' }}>{subject.name}</strong>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    {subject.credits} TC • Ưu tiên {calculatePriority(subject, index)}/10
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button onClick={() => moveSubject(index, -1)} disabled={index === 0} className="priority-btn up">↑</button>
                  <button onClick={() => moveSubject(index, 1)} disabled={index === selectedSubjects.length - 1} className="priority-btn down">↓</button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <SectionDivider title="Ràng buộc bổ sung" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '15px' }}>
        <ConstraintToggle label="Tránh xếp các môn học liên tiếp" checked={constraints.avoidConsecutive} onChange={(c) => setConstraints({ ...constraints, avoidConsecutive: c })} />
        <ConstraintToggle label="Cân bằng số môn học giữa các ngày" checked={constraints.balanceDays} onChange={(c) => setConstraints({ ...constraints, balanceDays: c })} />
        <ConstraintToggle label="Ưu tiên học buổi sáng" checked={constraints.preferMorning} onChange={(c) => setConstraints({ ...constraints, preferMorning: c })} />
        <ConstraintToggle label="Cho phép học thứ 7" checked={constraints.allowSaturday} onChange={(c) => setConstraints({ ...constraints, allowSaturday: c })} />
      </div>

      <div style={{ marginTop: '25px', textAlign: 'center' }}>
        <button
          onClick={handleGenerate} disabled={selectedSubjects.length === 0}
          className={`btn-rounded ${selectedSubjects.length === 0 ? 'btn-disabled' : 'btn-primary-gradient'}`}
        >
          Tạo thời khóa biểu
        </button>
      </div>
    </div >
  );
}

function ScheduleTable({ schedule }) {
  if (!schedule || !schedule.schedule) return null;
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const sessions = ['Sáng', 'Chiều', 'Tối'];
  const sessionTimes = {
    Sáng: ['07:30', '08:15', '09:00', '09:45', '10:30', '11:15'],
    Chiều: ['12:30', '13:15', '14:00', '14:45', '15:30', '16:15'],
    Tối: ['17:30', '18:15', '19:00', '19:45', '20:30', '21:15'],
  };

  const scheduleMap = {};
  schedule.schedule.forEach((item) => {
    if (!scheduleMap[item.time]) scheduleMap[item.time] = [];
    scheduleMap[item.time].push(item);
  });

  return (
    <div style={{ marginTop: '20px', overflowX: 'auto' }}>
      <table className="schedule-table">
        <thead>
          <tr>
            <th className="schedule-th">Buổi</th>
            {days.map(day => <th key={day} className="schedule-th">{dayTitle[day]}</th>)}
            <th className="schedule-th">Khung giờ (45' / tiết)</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session}>
              <td className="session-label">{session}</td>
              {days.map(day => {
                const key = `${day}_${session}`;
                const items = scheduleMap[key] || [];
                return (
                  <td key={key} className="schedule-td">
                    {items.length === 0 ? <span style={{ color: '#475569', fontStyle: 'italic' }}>Trống</span> :
                      items.map((item, idx) => (
                        <div key={idx} style={{ backgroundColor: item.is_retake ? 'rgba(251,113,133,0.2)' : 'rgba(59,130,246,0.2)', borderLeft: `4px solid ${item.is_retake ? '#fb7185' : '#38bdf8'}`, borderRadius: '10px', padding: '8px', marginBottom: '8px' }}>
                          <strong>{item.subject}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>GV: {item.instructor || 'Chưa cập nhật'}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.start_time} - {item.end_time}</div>
                          {item.is_retake && <div style={{ fontSize: '11px', color: '#fda4af' }}>Môn học lại</div>}
                        </div>
                      ))}
                  </td>
                );
              })}
              <td style={{ padding: '12px', border: '1px solid rgba(148,163,184,0.15)', color: '#a5b4fc' }}>{sessionTimes[session].join(' → ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Scheduler() {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [generationContext, setGenerationContext] = useState(null);
  const [compareResults, setCompareResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [lastPayload, setLastPayload] = useState(null);
  const [convergenceData, setConvergenceData] = useState(null);
  const [algorithmUsed, setAlgorithmUsed] = useState(null);
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [isBenchmarkLoading, setIsBenchmarkLoading] = useState(false);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setGenerationContext({
      studyInfo: formData.studyInfo,
      subjects: formData.subjects
    });
    setCompareResults(null);
    setBenchmarkResults(null);
    setAlgorithmUsed(formData.algorithm);

    try {
      const payloadSubjects = formData.subjects.map((subject) => ({
        ...subject, is_retake: subject.is_retake || false,
      }));
      const payload = {
        subjects: payloadSubjects,
        available_time_slots: formData.availableSlots,
        constraints: formData.constraints,
        additionalConstraints: formData.additionalConstraints,
        algorithm: formData.algorithm,
      };
      setLastPayload(payload);
      const response = await api.post('/api/schedule', payload);
      setSchedule(response.data);
      setConflicts(response.data.removed_conflicts || []);
      const algo = (formData.algorithm || 'ga').toLowerCase();
      if ((algo === 'ga' || algo === 'sa') && response.data.convergence?.length) {
        setConvergenceData(response.data.convergence);
      } else {
        setConvergenceData(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Có lỗi xảy ra';
      alert('Lỗi: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBenchmark = async () => {
    setIsBenchmarkLoading(true);
    try {
      const response = await api.post('/api/schedule/benchmark');
      setBenchmarkResults(response.data.benchmark_results || []);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Không thể tải kết quả benchmark';
      alert('Lỗi: ' + errorMessage);
    } finally {
      setIsBenchmarkLoading(false);
    }
  };

  const handleCompareAll = async () => {
    if (!lastPayload) {
      alert('Vui lòng tạo thời khóa biểu ít nhất 1 lần trước khi so sánh.');
      return;
    }
    setIsComparing(true);
    try {
      const response = await api.post('/api/schedule/compare', lastPayload);
      setCompareResults(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Có lỗi xảy ra khi so sánh thuật toán';
      alert('Lỗi: ' + errorMessage);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <>
      <SchedulerForm onGenerate={handleGenerate} />
      {isLoading && <div style={{ textAlign: 'center', padding: '20px', color: '#22d3ee' }}><h3>Đang tối ưu thời khóa biểu...</h3></div>}
      <div style={{ marginTop: '16px', textAlign: 'center', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
        <button onClick={handleCompareAll} disabled={isLoading || isComparing || !lastPayload} className="btn-rounded btn-cyan">
          {isComparing ? 'Đang so sánh...' : 'So sánh tất cả thuật toán'}
        </button>
        <button type="button" onClick={handleBenchmark} disabled={isLoading || isBenchmarkLoading} className="btn-rounded btn-cyan">
          {isBenchmarkLoading ? 'Đang chạy benchmark...' : 'Xem Benchmark'}
        </button>
      </div>
      {benchmarkResults && benchmarkResults.length > 0 && (
        <div style={{ marginTop: '28px' }}>
          <h3 style={{ color: '#0c4a6e', marginBottom: '16px' }}>Bảng thực nghiệm benchmark (5 bộ dữ liệu mẫu)</h3>
          {benchmarkResults.map((row) => (
            <div key={row.case} style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 8px', color: '#075985', fontSize: '1rem' }}>
                {row.case} — {row.n_subjects} môn — Tốt nhất: {algoLabel[row.best_algorithm] || row.best_algorithm}
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table className="compare-table schedule-table">
                  <thead>
                    <tr>
                      <th className="schedule-th">Thuật toán</th>
                      <th className="schedule-th">Chi phí (Cost)</th>
                      <th className="schedule-th">Thời gian (ms)</th>
                      <th className="schedule-th">Môn bị loại</th>
                      <th className="schedule-th">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['ga', 'hill_climbing', 'sa', 'minimax'].map((algo) => {
                      const data = row.results[algo];
                      if (!data) return null;
                      return (
                        <tr key={algo} className={algo === row.best_algorithm ? 'best-row' : ''}>
                          <td className="schedule-td">{algoLabel[algo] || algo}</td>
                          <td className="schedule-td">{data.cost}</td>
                          <td className="schedule-td">{data.time_ms} ms</td>
                          <td className="schedule-td">{data.removed_count} môn</td>
                          <td className="schedule-td">{algo === row.best_algorithm ? '🏆 Tốt nhất' : ''}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
      {compareResults?.results && (
        <div style={{ marginTop: '16px', overflowX: 'auto' }}>
          <table className="compare-table schedule-table">
            <thead>
              <tr>
                <th className="schedule-th">Thuật toán</th>
                <th className="schedule-th">Chi phí (Cost)</th>
                <th className="schedule-th">Thời gian (ms)</th>
                <th className="schedule-th">Môn bị loại</th>
                <th className="schedule-th">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(compareResults.results).map(([algo, data]) => (
                <tr key={algo} className={algo === compareResults.best_algorithm ? 'best-row' : ''}>
                  <td className="schedule-td">{algoLabel[algo] || algo}</td>
                  <td className="schedule-td">{data.cost}</td>
                  <td className="schedule-td">{data.time_ms} ms</td>
                  <td className="schedule-td">{data.removed_count} môn</td>
                  <td className="schedule-td">{algo === compareResults.best_algorithm ? '🏆 Tốt nhất' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {conflicts.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', borderRadius: '12px', backgroundColor: '#2f1f2f', border: '1px solid rgba(248,113,113,0.4)', color: '#fecaca' }}>
          <strong>Các môn đã bị loại bỏ do trùng thời gian:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '18px' }}>
            {conflicts.map((item, idx) => <li key={idx}>{item.subject} ({item.reason})</li>)}
          </ul>
        </div>
      )}
      {schedule && !isLoading && (
        <div className="schedule-result-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Thời khóa biểu đề xuất (Cost: {schedule.cost})</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => exportToPDF(schedule.schedule, 'Thoi_khoa_bieu')} className="btn-rounded btn-cyan">📄 PDF</button>
              <button onClick={() => exportToExcel(schedule.schedule, 'Thoi_khoa_bieu')} className="btn-rounded btn-cyan">📊 Excel</button>
            </div>
          </div>

          {/* Cảnh báo tín chỉ tối thiểu */}
          {(() => {
            if (!generationContext) return null;
            const { studyInfo, subjects } = generationContext;
            const scheduledSubjects = subjects.filter(s => !conflicts.some(c => c.subject === s.name));
            const totalCredits = scheduledSubjects.reduce((sum, s) => sum + (s.credits || 0), 0);
            const minCredits = studyInfo.minCredits || 0;

            if (minCredits > 0 && totalCredits < minCredits) {
              return (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>⚠️</span>
                  <div>
                    <strong>Cảnh báo: Không đủ tín chỉ tối thiểu!</strong>
                    <div style={{ fontSize: '14px', marginTop: '2px' }}>
                      Thời khóa biểu này chỉ có <strong>{totalCredits}</strong> tín chỉ (Yêu cầu tối thiểu: <strong>{minCredits}</strong> tín chỉ).
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          <ScheduleTable schedule={schedule} />

          {convergenceData && convergenceData.length > 0 && (algorithmUsed === 'ga' || algorithmUsed === 'sa') && (
            <div className="convergence-chart">
              <h3>Biểu đồ hội tụ — {algoLabelVi[algorithmUsed] || algorithmUsed}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={convergenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    label={{ value: 'Vòng lặp / Thế hệ', position: 'insideBottom', offset: -4 }}
                  />
                  <YAxis label={{ value: 'Cost', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#2563eb"
                    dot={false}
                    name="Chi phí tốt nhất / hiện tại"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function SchedulerPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="scheduler-page-container">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="scheduler-header"
      >
        <div>
          <h1 className="header-title">🎓 Smart Scheduler</h1>
          <p className="header-subtitle">Xin chào, {user?.username || 'Bạn'} 👋</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/problem" className="btn-rounded btn-cyan" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Mô tả bài toán
          </Link>
          {user?.is_admin && (
            <motion.button
              onClick={() => navigate('/admin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-rounded btn-pink"
            >
              ⚙️ Quản trị môn học
            </motion.button>
          )}
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-rounded btn-cyan"
          >
            Đăng xuất
          </motion.button>
        </div>
      </motion.header>
      <Scheduler />
    </div>
  );
}

export default SchedulerPage;