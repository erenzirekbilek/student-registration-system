import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AIChat from '../../components/common/AIChat';

// Lucide-style inline SVG icons (no emoji, no MUI)
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
  Grades: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Attendance: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  Notices: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
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
  BarChart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  GraduationCap: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Lock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  EmptyBox: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
};

const gradeColor = (grade) => {
  if (!grade || grade === 'N/A') return { bg: 'bg-slate-100', text: 'text-slate-500' };
  if (grade.startsWith('A')) return { bg: 'bg-emerald-50', text: 'text-emerald-700' };
  if (grade.startsWith('B')) return { bg: 'bg-sky-50', text: 'text-sky-700' };
  return { bg: 'bg-amber-50', text: 'text-amber-700' };
};

const EmptyState = ({ icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-slate-300 mb-4">{icon || <Icons.EmptyBox />}</div>
    <p className="text-sm font-medium text-slate-500">{title || 'No data yet'}</p>
    {description && <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>}
  </div>
);

const StudentPanel = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('studentData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserData(parsed);
      if (!parsed.classId) setLoading(false);
    } else {
      setLoading(false);
      navigate('/StudentLogin', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!userData?.classId) { setLoading(false); return; }
    const fetchData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          fetch('http://localhost:8080/api/courses'),
          fetch('http://localhost:8080/api/students'),
        ]);
        const cData = cRes.ok ? await cRes.json() : [];
        const sData = sRes.ok ? await sRes.json() : [];
        setCourses(cData.filter(c => c.classId === userData.classId));
        setAllStudents(sData);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem('studentData');
    navigate('/StudentLogin');
  };

  if (!userData || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={28} thickness={4} sx={{ color: '#6366f1' }} />
          <p className="text-slate-400 text-sm mt-3 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const { email, id, name, studentNumber } = userData;

  if (!email) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Icons.Lock />
          </div>
          <p className="text-slate-600 font-medium mb-1">Session expired</p>
          <p className="text-slate-400 text-sm mb-4">Please sign in to continue</p>
          <Link to="/StudentLogin" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Enrolled Courses', value: courses.length, icon: <Icons.BookOpen />, accent: '#6366f1', bg: '#eef2ff' },
    { label: 'Total Students', value: allStudents.length, icon: <Icons.Users />, accent: '#0ea5e9', bg: '#f0f9ff' },
    { label: 'Attendance', value: userData?.attendance ?? '—', icon: <Icons.BarChart />, accent: '#10b981', bg: '#ecfdf5' },
    { label: 'Grade', value: userData?.grade ?? '—', icon: <Icons.GraduationCap />, accent: '#f59e0b', bg: '#fffbeb' },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: Icons.Dashboard },
    { id: 'courses',   label: 'My Courses', Icon: Icons.Courses },
    { id: 'grades',    label: 'Grades',     Icon: Icons.Grades },
    { id: 'attendance',label: 'Attendance', Icon: Icons.Attendance },
    { id: 'notices',   label: 'Notices',    Icon: Icons.Notices },
    { id: 'settings',  label: 'Settings',   Icon: Icons.Settings },
  ];

  const sidebarW = isSidebarOpen ? 'w-56' : 'w-16';
  const contentML = isSidebarOpen ? 'ml-56' : 'ml-16';

  /* ─── tab labels ─── */
  const tabLabel = menuItems.find(m => m.id === activeTab)?.label ?? 'Dashboard';

  /* ─────────────────── RENDER CONTENT ─────────────────── */
  const renderContent = () => {
    switch (activeTab) {

      /* ── DASHBOARD ── */
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stat cards */}
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

            {/* Lower panels */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Courses mini */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">Current Courses</h3>
                  <button onClick={() => setActiveTab('courses')} className="text-xs text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1">
                    View all <Icons.ArrowRight />
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {courses.length === 0
                    ? <EmptyState title="No courses found" description="You haven't been assigned any courses yet." />
                    : courses.slice(0, 4).map((c) => (
                      <div key={c.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-slate-700">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.description || 'No description'}</p>
                        </div>
                        <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">{c.credit} CR</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Notices mini */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">Recent Notices</h3>
                  <button onClick={() => setActiveTab('notices')} className="text-xs text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1">
                    View all <Icons.ArrowRight />
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {allStudents.length === 0
                    ? <EmptyState title="No notices" description="There are no announcements right now." />
                    : allStudents.slice(0, 4).map((n, i) => (
                      <div key={i} className="px-6 py-3.5 flex items-start justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-slate-700">{n.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">{n.email}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full mt-0.5">STUDENT</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        );

      /* ── COURSES ── */
      case 'courses':
        return courses.length === 0
          ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <EmptyState icon={<Icons.Courses />} title="No courses enrolled" description="Once you're assigned to a class, your courses will appear here." />
            </div>
          )
          : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all overflow-hidden group">
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className="text-sm font-semibold text-slate-800 truncate">{c.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{c.description || 'No description available'}</p>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{c.credit} CR</span>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-slate-300"><Icons.Calendar /></span>
                        {c.schedule || 'Schedule TBA'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-slate-300"><Icons.MapPin /></span>
                        {c.room || 'Room TBA'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 text-xs font-medium py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Details</button>
                      <button className="flex-1 text-xs font-medium py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Assignments</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );

      /* ── GRADES ── */
      case 'grades':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50">
              <h3 className="text-sm font-semibold text-slate-700">Academic Grades</h3>
              <p className="text-xs text-slate-400 mt-0.5">Current semester performance</p>
            </div>
            {courses.length === 0
              ? <EmptyState title="No grade data" description="Grades will appear here once courses are assigned." />
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {courses.map((c, i) => {
                        const g = gradeColor(userData?.grade);
                        return (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3.5 font-medium text-slate-700">{c.name}</td>
                            <td className="px-6 py-3.5 text-slate-400">—</td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${g.bg} ${g.text}`}>
                                {userData?.grade || 'N/A'}
                              </span>
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
        );

      /* ── NOTICES ── */
      case 'notices':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50">
              <h3 className="text-sm font-semibold text-slate-700">Announcements</h3>
              <p className="text-xs text-slate-400 mt-0.5">{allStudents.length} entries</p>
            </div>
            {allStudents.length === 0
              ? <EmptyState title="No notices available" description="New announcements from your institution will appear here." />
              : (
                <div className="divide-y divide-slate-50">
                  {allStudents.slice(0, 6).map((s, i) => (
                    <div key={i} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">STUDENT</span>
                          <p className="text-sm font-semibold text-slate-700">{s.name}</p>
                        </div>
                        <p className="text-xs text-slate-400">Class ID: {s.classId || 'N/A'}</p>
                      </div>
                      <p className="text-xs text-slate-400">{s.email}</p>
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
            {/* Profile */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Profile Settings</h3>
              <div className="space-y-4">
                {[{ label: 'Full Name', type: 'text', val: name }, { label: 'Email Address', type: 'email', val: email }].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{f.label}</label>
                    <input type={f.type} defaultValue={f.val}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition" />
                  </div>
                ))}
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Change Password</h3>
              <div className="space-y-4">
                {['Current Password', 'New Password', 'Confirm New Password'].map(lbl => (
                  <div key={lbl}>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{lbl}</label>
                    <input type="password"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition" />
                  </div>
                ))}
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors">
                  Update Password
                </button>
              </div>
            </div>

            {/* Danger */}
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

  /* ────────────────────────── SHELL ────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 h-14 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 tracking-tight">Student Management</span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-700">{name}</p>
            <p className="text-[11px] text-slate-400">{email}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-700 font-bold text-sm">{(name || 'S')[0].toUpperCase()}</span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed top-14 left-0 bottom-0 ${sidebarW} bg-white border-r border-slate-100 z-40 transition-all duration-200 flex flex-col`}>
        {/* Toggle */}
        <div className="h-12 flex items-center px-3 border-b border-slate-50">
          {isSidebarOpen && (
            <div className="flex-1 min-w-0 px-1">
              <p className="text-xs font-semibold text-slate-700 truncate">{name || 'Student'}</p>
              <p className="text-[11px] text-slate-400 truncate">{studentNumber || id}</p>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
            {isSidebarOpen ? <Icons.ChevronLeft /> : <Icons.Menu />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {menuItems.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
                  ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                <span className={`shrink-0 ${active ? 'text-indigo-600' : ''}`}><Icon /></span>
                {isSidebarOpen && (
                  <span className={`text-sm font-medium truncate ${active ? 'text-indigo-700' : ''}`}>{label}</span>
                )}
                {active && isSidebarOpen && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="px-2 pb-3 pt-2 border-t border-slate-50">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
            <span className="shrink-0"><Icons.Logout /></span>
            {isSidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`${contentML} pt-14 transition-all duration-200`}>
        <div className="p-6 max-w-6xl">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-800">{tabLabel}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === 'dashboard' ? `Welcome back, ${name?.split(' ')[0] || 'Student'}` : `Manage your ${tabLabel.toLowerCase()}`}
            </p>
          </div>

          {renderContent()}
        </div>
      </main>

      <AIChat userId={id} role="STUDENT" />
    </div>
  );
};

export default StudentPanel;