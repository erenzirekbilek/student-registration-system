import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CircularProgress from '@mui/material/CircularProgress';

const StudentPanel = () => {
  const location = useLocation();
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
      setUserData(JSON.parse(stored));
    } else {
      navigate('/StudentLogin', { replace: true });
    }
  }, [navigate]);

  const fetchData = async () => {
    if (!userData?.classId) return;
    setLoading(true);
    try {
      const coursesRes = await fetch('http://localhost:8080/api/courses');
      const studentsRes = await fetch('http://localhost:8080/api/students');
      
      const coursesData = coursesRes.ok ? await coursesRes.json() : [];
      const studentsData = studentsRes.ok ? await studentsRes.json() : [];
      
      const myCourses = coursesData.filter(c => c.classId === userData.classId);
      setCourses(myCourses);
      setAllStudents(studentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.classId) {
      fetchData();
    } else if (!userData) {
      setLoading(false);
    }
  }, [userData]);

  const stats = [
    { label: 'Enrolled Courses', value: courses.length, icon: '📚', color: 'from-blue-500 to-blue-600' },
    { label: 'Total Students', value: allStudents.length, icon: '👥', color: 'from-green-500 to-green-600' },
    { label: 'Attendance', value: userData?.attendance || 'N/A', icon: '📊', color: 'from-purple-500 to-purple-600' },
    { label: 'Grade', value: userData?.grade || 'N/A', icon: '🎓', color: 'from-orange-500 to-orange-600' },
  ];

  if (!userData || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress className="text-indigo-500" />
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const { email, id, name } = userData;

  if (!email) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-gray-400 mb-4">Please login first</p>
          <Link to="/StudentLogin" className="text-indigo-400 hover:text-indigo-300">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'courses', label: 'My Courses', icon: '📚' },
    { id: 'grades', label: 'Grades', icon: '📝' },
    { id: 'attendance', label: 'Attendance', icon: '✅' },
    { id: 'notices', label: 'Notices', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('studentData');
    navigate('/StudentLogin');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Current Courses</h3>
                <div className="space-y-3">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{course.name}</p>
                        <p className="text-gray-400 text-sm">Credits: {course.credit}</p>
                      </div>
                      <span className="text-indigo-400 text-sm">{course.credit} CR</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('courses')} className="w-full mt-4 text-indigo-400 hover:text-indigo-300 text-sm">
                  View All Courses →
                </button>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Notices</h3>
                <div className="space-y-3">
                  {allStudents.slice(0, 3).map((notice, idx) => (
                    <div key={idx} className="p-3 bg-slate-700/50 rounded-xl">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-white font-medium">{notice.name}</p>
                        <span className="text-xs text-gray-400">{notice.email}</span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-1">{notice.email}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('notices')} className="w-full mt-4 text-indigo-400 hover:text-indigo-300 text-sm">
                  View All Notices →
                </button>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:shadow-xl">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{course.name}</h3>
                      <p className="text-gray-400 text-sm">{course.description || 'No description'}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-full">
                      {course.credit} CR
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <div className="flex items-center">
                      <span className="w-5">📅</span>
                      <span className="ml-2">{course.schedule || 'TBA'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-5">📍</span>
                      <span className="ml-2">{course.room || 'TBA'}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1">Details</Button>
                    <Button size="sm" className="flex-1">Assignments</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'grades':
        return (
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Academic Grades</h3>
              <p className="text-gray-400 text-sm">Current semester performance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {courses.map((course, i) => (
                    <tr key={i} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-white">{course.name}</td>
                      <td className="px-6 py-4 text-gray-300">-</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userData?.grade?.startsWith('A') ? 'bg-green-500/20 text-green-400' :
                          userData?.grade?.startsWith('B') ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {userData?.grade || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'notices':
        return (
          <div className="space-y-4">
            {allStudents.length > 0 ? allStudents.slice(0, 5).map((student, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      STUDENT
                    </span>
                    <h4 className="text-lg font-semibold text-white">{student.name}</h4>
                  </div>
                  <span className="text-sm text-gray-400">{student.email}</span>
                </div>
                <p className="text-gray-400">Class ID: {student.classId || 'N/A'}</p>
              </div>
            )) : (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 text-center">
                <p className="text-gray-400">No notices available</p>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    defaultValue={name}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={email}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <Button>Save Changes</Button>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <Button>Update Password</Button>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-red-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Logout</h3>
              <p className="text-gray-400 mb-4">Sign out of your account</p>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 text-center">
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-white hover:text-indigo-300 transition-colors">Student Management System</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed top-16 inset-y-0 left-0 ${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-800/50 backdrop-blur-lg border-r border-white/10 z-40 transition-all duration-300`}>
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          {isSidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{name || 'Student'}</p>
                <p className="text-xs text-gray-400">{id}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${isSidebarOpen ? 'px-4 py-3' : 'px-2 py-3 justify-center'} rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            ))}
            <li className="pt-4 mt-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center ${isSidebarOpen ? 'px-4 py-3' : 'px-2 py-3 justify-center'} rounded-xl text-red-400 hover:bg-red-500/10 transition-all`}
              >
                <span className="text-xl">🚪</span>
                {isSidebarOpen && <span className="ml-3">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 transition-all duration-300`}>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
            <p className="text-gray-400 mt-1">{email}</p>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentPanel;
