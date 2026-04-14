import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import AIChat from '../../components/common/AIChat';
import {
  useGetAttendanceByCourseQuery,
  useGetCoursesByTeacherQuery,
  useGetStudentsQuery,
  useMarkAttendanceMutation,
  useGetCoursesQuery,
  useGetNoticesQuery
} from '../../RTK/userAPI';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* ─── Inline SVG icon system ─── */
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Courses: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Classes: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Students: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Attendance: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Notices: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Assignments: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Grades: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41M12 22v-2M19.07 19.07l-1.41-1.41M22 12h-2"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Menu: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  School: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  EmptyBox: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

/* ─── Shared primitives ─── */
const EmptyState = ({ icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-slate-300 mb-4">{icon || <Icons.EmptyBox />}</div>
    <p className="text-sm font-medium text-slate-500">{title || 'No data yet'}</p>
    {description && <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>}
  </div>
);

const Field = ({ label, type = 'text', value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
    />
  </div>
);

/* ─── Modal wrapper ─── */
const Modal = ({ title, onClose, onSubmit, children }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
          <Icons.X />
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="px-6 py-5 space-y-4">{children}</div>
        <div className="px-6 py-4 border-t border-slate-50 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors">Save</button>
        </div>
      </form>
    </div>
  </div>
);

/* ─── Main component ─── */
const TeacherPanel = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [studentGrades, setStudentGrades] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeForm, setGradeForm] = useState({ assignmentId: '', score: '', feedback: '' });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', courseId: '', dueDate: '', totalPoints: 100 });
  const [selectedCourseForAttendance, setSelectedCourseForAttendance] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  
  const { data: coursesData } = useGetCoursesQuery();
  const { data: studentsData } = useGetStudentsQuery();
  const { data: teacherCoursesData } = useGetCoursesByTeacherQuery(userData?.id, { skip: !userData?.id });
  const { data: courseAttendanceData } = useGetAttendanceByCourseQuery(selectedCourseForAttendance, { skip: !selectedCourseForAttendance });
  const [markAttendance] = useMarkAttendanceMutation();
  const { data: noticesData } = useGetNoticesQuery();
  
  const courseAttendance = courseAttendanceData || [];
  const notices = noticesData || [];
  
  const teacherCourses = teacherCoursesData || courses?.filter(c => c.teacherId === userData?.id) || [];
  const courseStudents = students?.filter(s => s.classId === courses?.find(c => c.id === selectedCourseForAttendance)?.classId) || [];

  useEffect(() => {
    const stored = localStorage.getItem('teacherData');
    if (stored) setUserData(JSON.parse(stored));
    else { setLoading(false); navigate('/TeacherLogin', { replace: true }); }
  }, [navigate]);

  useEffect(() => {
    if (!userData?.id) { setLoading(false); return; }
    if (coursesData) setCourses(coursesData);
    if (studentsData) setStudents(studentsData);
    if (teacherCoursesData) setCourses(teacherCoursesData);
    setLoading(false);
  }, [userData, coursesData, studentsData, teacherCoursesData]);

  const handleLogout = () => { localStorage.removeItem('teacherData'); navigate('/TeacherLogin'); };

  const markStudentAttendance = (studentId, status) => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    const course = courses?.find(c => c.id === selectedCourseForAttendance);
    if (!course) return;
    
    const classStudents = students?.filter(s => s.classId === course.classId) || [];
    
    for (const student of classStudents) {
      const status = attendanceRecords[student.id];
      if (status) {
        await markAttendance({
          studentId: student.id,
          courseId: selectedCourseForAttendance,
          date: attendanceDate,
          status: status,
          notes: ''
        }).unwrap();
      }
    }
    
    setAttendanceRecords({});
    setSelectedCourseForAttendance(null);
  };

  if (!userData || loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <CircularProgress size={28} thickness={4} sx={{ color: '#7c3aed' }} />
        <p className="text-slate-400 text-sm mt-3 font-medium">Loading your dashboard…</p>
      </div>
    </div>
  );

  const { email, id, name, specialty } = userData;

  const statCards = [
    { label: 'Active Courses', value: courses.length,  icon: <Icons.BookOpen />, accent: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Total Students', value: students.length, icon: <Icons.Users />,    accent: '#0ea5e9', bg: '#f0f9ff' },
    { label: 'Classes',        value: classes.length,  icon: <Icons.School />,   accent: '#10b981', bg: '#ecfdf5' },
    { label: 'This Week',      value: '3',             icon: <Icons.Calendar />, accent: '#f59e0b', bg: '#fffbeb' },
  ];

  const menuItems = [
    { id: 'dashboard',   label: 'Dashboard',   Icon: Icons.Dashboard },
    { id: 'courses',     label: 'My Courses',  Icon: Icons.Courses },
    { id: 'classes',     label: 'Classes',     Icon: Icons.Classes },
    { id: 'students',    label: 'My Students', Icon: Icons.Students },
    { id: 'attendance',  label: 'Attendance',   Icon: Icons.Attendance },
    { id: 'notices',     label: 'Notices',     Icon: Icons.Notices },
    { id: 'assignments', label: 'Assignments', Icon: Icons.Assignments },
    { id: 'grades',      label: 'Grade Book',  Icon: Icons.Grades },
    { id: 'settings',    label: 'Settings',    Icon: Icons.Settings },
  ];

  const tabLabel = menuItems.find(m => m.id === activeTab)?.label ?? 'Dashboard';
  const sidebarW  = isSidebarOpen ? 'w-56' : 'w-16';
  const contentML = isSidebarOpen ? 'ml-56' : 'ml-16';

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ─── chart data for dashboard ─── */
  const enrollmentTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Students Enrolled',
        data: [120, 145, 160, 175, 190, students.length],
        borderColor: 'rgb(124, 58, 237)',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const courseEnrollmentData = {
    labels: courses.map(c => c.name?.split(' ').slice(0, 2).join(' ') || 'Course'),
    datasets: [
      {
        label: 'Students',
        data: courses.length > 0 ? courses.map(() => Math.floor(Math.random() * 20) + 5) : [],
        backgroundColor: [
          'rgba(124, 58, 237, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(167, 139, 250, 0.7)',
          'rgba(192, 132, 252, 0.7)',
        ],
        borderRadius: 6,
      },
    ],
  };

  const studentAttendanceData = {
    labels: ['Present', 'Absent', 'Late', 'Excused'],
    datasets: [
      {
        data: [75, 15, 7, 3],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(100, 116, 139, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#64748b', padding: 15, usePointStyle: true } },
    },
    cutout: '65%',
  };

  /* ────────────── RENDER CONTENT ────────────── */
  const renderContent = () => {
    switch (activeTab) {

      /* ── DASHBOARD ── */
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {statCards.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg, color: s.accent }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800 leading-none">{s.value}</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Enrollment Trend */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">Student Enrollment Trend</h3>
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <div className="h-56">
                  <Line data={enrollmentTrendData} options={chartOptions} />
                </div>
              </div>

              {/* Attendance Distribution */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Attendance Overview</h3>
                <div className="h-56">
                  <Doughnut data={studentAttendanceData} options={doughnutOptions} />
                </div>
              </div>
            </div>

            {/* Course Enrollment Bar Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700">Students per Course</h3>
                <span className="text-xs text-violet-500 font-medium">{courses.length} courses</span>
              </div>
              <div className="h-48">
                {courses.length > 0 ? (
                  <Bar data={courseEnrollmentData} options={chartOptions} />
                ) : (
                  <EmptyState icon={<Icons.Courses />} title="No courses" description="Create courses to see enrollment data" />
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick actions */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50">
                  <h3 className="text-sm font-semibold text-slate-700">Quick Actions</h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Manage Courses',    tab: 'courses' },
                    { label: 'View Students',     tab: 'students' },
                    { label: 'Create Assignment', tab: 'assignments' },
                    { label: 'Update Grades',     tab: 'grades' },
                  ].map(a => (
                    <button key={a.tab} onClick={() => setActiveTab(a.tab)}
                      className="text-sm font-medium py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors text-left flex items-center justify-between group">
                      {a.label}
                      <span className="text-slate-300 group-hover:text-violet-500 transition-colors"><Icons.ArrowRight /></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent assignments */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">Recent Assignments</h3>
                  <button onClick={() => setActiveTab('assignments')} className="text-xs text-violet-500 hover:text-violet-600 font-medium flex items-center gap-1">
                    View all <Icons.ArrowRight />
                  </button>
                </div>
                {assignments.length === 0
                  ? <EmptyState title="No assignments yet" description="Create your first assignment to track student progress." />
                  : (
                    <div className="divide-y divide-slate-50">
                      {assignments.slice(0, 4).map(a => (
                        <div key={a.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-slate-700">{a.title}</p>
                            <p className="text-xs text-slate-400">{courses.find(c => c.id === a.courseId)?.name || '—'}</p>
                          </div>
                          <span className="text-xs text-slate-400">{a.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        );

      /* ── COURSES ── */
      case 'courses':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{courses.length} course{courses.length !== 1 ? 's' : ''} found</p>
              <button onClick={() => navigate('/TeacherCourseAdd')}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors">
                <Icons.Plus /> Add Course
              </button>
            </div>
            {courses.length === 0
              ? <div className="bg-white rounded-2xl border border-slate-100 shadow-sm"><EmptyState icon={<Icons.Courses />} title="No courses yet" description="Add your first course to get started." /></div>
              : (
                <div className="grid md:grid-cols-2 gap-4">
                  {courses.map(c => (
                    <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-100 transition-all overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 pr-3">
                            <h3 className="text-sm font-semibold text-slate-800 truncate">{c.name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{c.schedule} · {c.room}</p>
                          </div>
                          <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {(c.status || 'active').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                          <span className="flex items-center gap-1"><Icons.Clock />{c.schedule || 'TBA'}</span>
                          <span className="flex items-center gap-1"><Icons.MapPin />{c.room || 'TBA'}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 text-xs font-medium py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Details</button>
                          <button className="flex-1 text-xs font-medium py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors">Manage</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        );

      /* ── CLASSES ── */
      case 'classes':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <div className="text-slate-300 mb-4"><Icons.School /></div>
            <p className="text-sm font-medium text-slate-600 mb-1">Manage class sections</p>
            <p className="text-xs text-slate-400 mb-5">View and edit all class sections assigned to you.</p>
            <button onClick={() => navigate('/ClassList')}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-2">
              Go to Class List <Icons.ArrowRight />
            </button>
          </div>
        );

      /* ── STUDENTS ── */
      case 'students':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">My Students</h3>
                <p className="text-xs text-slate-400 mt-0.5">{filteredStudents.length} students enrolled</p>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></span>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search students…"
                  className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition w-56" />
              </div>
            </div>
            {filteredStudents.length === 0
              ? <EmptyState title="No students found" description="Try a different search term." />
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-50">
                        {['Name', 'Student No.', 'Email', 'Attendance', 'Grade', ''].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredStudents.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3.5 font-semibold text-slate-700">{s.name}</td>
                          <td className="px-6 py-3.5 text-slate-500">{s.studentNumber || '—'}</td>
                          <td className="px-6 py-3.5 text-slate-500">{s.email}</td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.attendance || 0}%` }} />
                              </div>
                              <span className="text-xs text-slate-500">{s.attendance || 0}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700">
                              {s.grade || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <button className="text-xs font-medium text-violet-600 hover:text-violet-700">View →</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        );

      /* ── ATTENDANCE ── */
      case 'attendance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Take Attendance</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Mark attendance for your courses</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Select Course</label>
                  <select 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    value={selectedCourseForAttendance || ''}
                    onChange={(e) => setSelectedCourseForAttendance(Number(e.target.value))}
                  >
                    <option value="">Choose a course...</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>
              </div>

              {selectedCourseForAttendance && (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Student</th>
                        <th className="px-6 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase">Present</th>
                        <th className="px-6 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase">Absent</th>
                        <th className="px-6 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase">Late</th>
                        <th className="px-6 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase">Excused</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {courseStudents.map(student => (
                        <tr key={student.id} className="hover:bg-slate-50">
                          <td className="px-6 py-3">
                            <div>
                              <p className="text-sm font-medium text-slate-700">{student.name}</p>
                              <p className="text-xs text-slate-400">{student.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button
                              onClick={() => markStudentAttendance(student.id, 'PRESENT')}
                              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                attendanceRecords[student.id] === 'PRESENT' 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-slate-200 hover:border-emerald-300'
                              }`}
                            >
                              ✓
                            </button>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button
                              onClick={() => markStudentAttendance(student.id, 'ABSENT')}
                              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                attendanceRecords[student.id] === 'ABSENT' 
                                  ? 'bg-red-500 border-red-500 text-white' 
                                  : 'border-slate-200 hover:border-red-300'
                              }`}
                            >
                              ✕
                            </button>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button
                              onClick={() => markStudentAttendance(student.id, 'LATE')}
                              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                attendanceRecords[student.id] === 'LATE' 
                                  ? 'bg-amber-500 border-amber-500 text-white' 
                                  : 'border-slate-200 hover:border-amber-300'
                              }`}
                            >
                              △
                            </button>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button
                              onClick={() => markStudentAttendance(student.id, 'EXCUSED')}
                              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                attendanceRecords[student.id] === 'EXCUSED' 
                                  ? 'bg-slate-500 border-slate-500 text-white' 
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              ?
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {selectedCourseForAttendance && courseStudents.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={saveAttendance}
                    disabled={!attendanceDate}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Save Attendance
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50">
                <h3 className="text-sm font-semibold text-slate-700">Attendance Records</h3>
              </div>
              {courseAttendance.length === 0 ? (
                <EmptyState title="No records" description="Take attendance to see records here" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {courseAttendance.slice(0, 20).map(att => {
                        const student = students.find(s => s.id === att.studentId);
                        return (
                          <tr key={att.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3.5 text-slate-600">{att.date}</td>
                            <td className="px-6 py-3.5 font-medium text-slate-700">{student?.name || 'Unknown'}</td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                att.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 
                                att.status === 'ABSENT' ? 'bg-red-50 text-red-700' : 
                                att.status === 'LATE' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700'
                              }`}>
                                {att.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      /* ── ASSIGNMENTS ── */
      case 'assignments':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{assignments.length} assignment{assignments.length !== 1 ? 's' : ''}</p>
              <button onClick={() => setShowAssignmentModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors">
                <Icons.Plus /> Create Assignment
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {assignments.length === 0
                ? <EmptyState icon={<Icons.Assignments />} title="No assignments yet" description="Create your first assignment and start tracking submissions." />
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-50">
                          {['Title', 'Course', 'Due Date', 'Points', ''].map(h => (
                            <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {assignments.map(a => (
                          <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3.5 font-semibold text-slate-700">{a.title}</td>
                            <td className="px-6 py-3.5 text-slate-500">{courses.find(c => c.id === a.courseId)?.name || '—'}</td>
                            <td className="px-6 py-3.5 text-slate-500">{a.dueDate}</td>
                            <td className="px-6 py-3.5">
                              <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg">{a.totalPoints} pts</span>
                            </td>
                            <td className="px-6 py-3.5">
                              <div className="flex gap-2">
                                <button className="text-xs font-medium text-slate-500 hover:text-slate-700">View</button>
                                <span className="text-slate-200">·</span>
                                <button className="text-xs font-medium text-violet-600 hover:text-violet-700">Grade</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </div>

            {showAssignmentModal && (
              <Modal title="Create New Assignment" onClose={() => setShowAssignmentModal(false)}
                onSubmit={e => {
                  e.preventDefault();
                  setAssignments([...assignments, { ...assignmentForm, id: Date.now(), courseId: parseInt(assignmentForm.courseId) }]);
                  setShowAssignmentModal(false);
                  setAssignmentForm({ title: '', description: '', courseId: '', dueDate: '', totalPoints: 100 });
                }}>
                <Field label="Title" value={assignmentForm.title} onChange={e => setAssignmentForm({...assignmentForm, title: e.target.value})} placeholder="Assignment title" required />
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Course</label>
                  <select value={assignmentForm.courseId} onChange={e => setAssignmentForm({...assignmentForm, courseId: e.target.value})} required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition">
                    <option value="">Select a course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Due Date" type="date" value={assignmentForm.dueDate} onChange={e => setAssignmentForm({...assignmentForm, dueDate: e.target.value})} required />
                  <Field label="Total Points" type="number" value={assignmentForm.totalPoints} onChange={e => setAssignmentForm({...assignmentForm, totalPoints: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
                  <textarea value={assignmentForm.description} onChange={e => setAssignmentForm({...assignmentForm, description: e.target.value})}
                    placeholder="Optional description…" rows={3}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition resize-none" />
                </div>
              </Modal>
            )}
          </div>
        );

      /* ── GRADE BOOK ── */
      case 'grades':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">Select a course to view grades</p>
              <select onChange={e => setSelectedCourse(courses.find(c => c.id === parseInt(e.target.value)) || null)}
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition shadow-sm">
                <option value="">Choose course…</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {!selectedCourse
              ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <EmptyState icon={<Icons.Grades />} title="No course selected" description="Choose a course above to view and manage student grades." />
                </div>
              )
              : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-50">
                    <h3 className="text-sm font-semibold text-slate-700">{selectedCourse.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedCourse.schedule} · Room {selectedCourse.room}</p>
                  </div>
                  {assignments.filter(a => a.courseId === selectedCourse.id).length === 0
                    ? <EmptyState title="No assignments for this course" description="Create assignments first to start grading." />
                    : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-50">
                              <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Student</th>
                              {assignments.filter(a => a.courseId === selectedCourse.id).map(a => (
                                <th key={a.id} className="px-4 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{a.title}</th>
                              ))}
                              <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg</th>
                              <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {students.slice(0, 10).map(s => {
                              const courseAssignments = assignments.filter(a => a.courseId === selectedCourse.id);
                              const scores = courseAssignments.map(a => studentGrades[`${a.id}-${s.id}`]?.score || 0);
                              const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—';
                              return (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-3.5 font-semibold text-slate-700">{s.name}</td>
                                  {courseAssignments.map(a => {
                                    const g = studentGrades[`${a.id}-${s.id}`];
                                    const pct = g ? (g.score / a.totalPoints) * 100 : null;
                                    return (
                                      <td key={a.id} className="px-4 py-3.5 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                                          pct === null ? 'text-slate-400 bg-slate-50' :
                                          pct >= 60 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                                        }`}>
                                          {g ? `${g.score}/${a.totalPoints}` : '—'}
                                        </span>
                                      </td>
                                    );
                                  })}
                                  <td className="px-4 py-3.5 text-center">
                                    <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full">{avg}</span>
                                  </td>
                                  <td className="px-4 py-3.5 text-center">
                                    <button onClick={() => { setSelectedStudent(s); setShowGradeModal(true); }}
                                      className="text-xs font-medium text-violet-600 hover:text-violet-700">Manage</button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )
                  }
                </div>
              )
            }

            {showGradeModal && selectedStudent && (
              <Modal title={`Grade: ${selectedStudent.name}`} onClose={() => { setShowGradeModal(false); setGradeForm({ assignmentId: '', score: '', feedback: '' }); }}
                onSubmit={e => {
                  e.preventDefault();
                  if (gradeForm.assignmentId && gradeForm.score) {
                    setStudentGrades({ ...studentGrades, [`${gradeForm.assignmentId}-${selectedStudent.id}`]: { score: parseFloat(gradeForm.score), feedback: gradeForm.feedback } });
                  }
                  setShowGradeModal(false);
                  setGradeForm({ assignmentId: '', score: '', feedback: '' });
                }}>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Assignment</label>
                  <select value={gradeForm.assignmentId} onChange={e => setGradeForm({...gradeForm, assignmentId: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition">
                    <option value="">Select assignment</option>
                    {assignments.filter(a => a.courseId === selectedCourse?.id).map(a => (
                      <option key={a.id} value={a.id}>{a.title} ({a.totalPoints} pts)</option>
                    ))}
                  </select>
                </div>
                <Field label="Score" type="number" value={gradeForm.score} onChange={e => setGradeForm({...gradeForm, score: e.target.value})} placeholder="Enter score" />
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Feedback <span className="text-slate-300">(optional)</span></label>
                  <textarea value={gradeForm.feedback} onChange={e => setGradeForm({...gradeForm, feedback: e.target.value})}
                    placeholder="Leave a note for the student…" rows={3}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition resize-none" />
                </div>
              </Modal>
            )}
          </div>
        );

      /* ── NOTICES ── */
      case 'notices':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">School Notices</h3>
                <p className="text-xs text-slate-400 mt-0.5">{notices.length} announcement{notices.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            {notices.length === 0
              ? <EmptyState icon={<Icons.Notices />} title="No notices" description="No announcements available at this time." />
              : (
                <div className="divide-y divide-slate-50">
                  {notices.map((notice, i) => (
                    <div key={i} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{notice.noticeType || 'Notice'}</span>
                          <p className="text-sm font-semibold text-slate-700">{notice.title}</p>
                        </div>
                        <span className="text-[10px] text-slate-400">{notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{notice.content}</p>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        );

      /* ── SETTINGS ── */
      case 'settings':
        return (
          <div className="max-w-2xl space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Profile Settings</h3>
              <div className="space-y-4">
                {[{ label: 'Full Name', type: 'text', val: name }, { label: 'Email Address', type: 'email', val: email }, { label: 'Specialty', type: 'text', val: specialty }].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{f.label}</label>
                    <input type={f.type} defaultValue={f.val}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition" />
                  </div>
                ))}
                <button className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors">Save Changes</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Change Password</h3>
              <div className="space-y-4">
                {['Current Password', 'New Password', 'Confirm New Password'].map(lbl => (
                  <div key={lbl}>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{lbl}</label>
                    <input type="password"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition" />
                  </div>
                ))}
                <button className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors">Update Password</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-1">Sign Out</h3>
              <p className="text-xs text-slate-400 mb-4">This will end your current session.</p>
              <button onClick={handleLogout}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium rounded-xl border border-rose-100 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <p className="text-slate-400 text-sm">Coming soon…</p>
          </div>
        );
    }
  };

  /* ────────────────────── SHELL ────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 h-14 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 tracking-tight">Teacher Management</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-700">{name}</p>
            <p className="text-[11px] text-slate-400">{specialty}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
            <span className="text-violet-700 font-bold text-sm">{(name || 'T')[0].toUpperCase()}</span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed top-14 left-0 bottom-0 ${sidebarW} bg-white border-r border-slate-100 z-40 transition-all duration-200 flex flex-col`}>
        <div className="h-12 flex items-center px-3 border-b border-slate-50">
          {isSidebarOpen && (
            <div className="flex-1 min-w-0 px-1">
              <p className="text-xs font-semibold text-slate-700 truncate">{name || 'Teacher'}</p>
              <p className="text-[11px] text-slate-400 truncate">{specialty || 'Faculty'}</p>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
            {isSidebarOpen ? <Icons.ChevronLeft /> : <Icons.Menu />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {menuItems.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
                  ${active ? 'bg-violet-50 text-violet-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                <span className={`shrink-0 ${active ? 'text-violet-600' : ''}`}><Icon /></span>
                {isSidebarOpen && (
                  <span className={`text-sm font-medium truncate ${active ? 'text-violet-700' : ''}`}>{label}</span>
                )}
                {active && isSidebarOpen && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />}
              </button>
            );
          })}
        </nav>

        <div className="px-2 pb-3 pt-2 border-t border-slate-50">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
            <span className="shrink-0"><Icons.Logout /></span>
            {isSidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`${contentML} pt-14 transition-all duration-200`}>
        <div className="p-6 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-800">{tabLabel}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === 'dashboard' ? `Welcome back, ${name?.split(' ')[0] || 'Teacher'}` : `Manage your ${tabLabel.toLowerCase()}`}
            </p>
          </div>
          {renderContent()}
        </div>
      </main>

      <AIChat userId={id} role="TEACHER" />
    </div>
  );
};

export default TeacherPanel;