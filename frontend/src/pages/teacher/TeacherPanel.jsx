import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const mockCourses = [
  { id: 1, name: 'Mathematics 101', students: 30, schedule: 'Mon/Wed 10:00', room: 'Room 101', status: 'active' },
  { id: 2, name: 'Physics 201', students: 25, schedule: 'Tue/Thu 14:00', room: 'Room 205', status: 'active' },
  { id: 3, name: 'Computer Science 101', students: 35, schedule: 'Fri 09:00', room: 'Lab 301', status: 'active' },
  { id: 4, name: 'Data Structures', students: 28, schedule: 'Mon/Wed 14:00', room: 'Lab 102', status: 'pending' },
];

const mockStudents = [
  { id: 1, name: 'John Doe', studentNumber: 'STU001', email: 'john@example.com', attendance: 95, grade: 'A' },
  { id: 2, name: 'Jane Smith', studentNumber: 'STU002', email: 'jane@example.com', attendance: 92, grade: 'A-' },
  { id: 3, name: 'Bob Wilson', studentNumber: 'STU003', email: 'bob@example.com', attendance: 88, grade: 'B+' },
  { id: 4, name: 'Alice Brown', studentNumber: 'STU004', email: 'alice@example.com', attendance: 90, grade: 'B' },
];

const mockAssignments = [
  { id: 1, title: 'Problem Set 1', course: 'Mathematics 101', dueDate: 'Oct 20, 2024', submissions: 25 },
  { id: 2, title: 'Lab Report', course: 'Physics 201', dueDate: 'Oct 22, 2024', submissions: 18 },
  { id: 3, title: 'Programming Assignment', course: 'Computer Science 101', dueDate: 'Oct 25, 2024', submissions: 30 },
];

const TeacherPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, id, name, specialty } = location.state || {};
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!email) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-gray-400 mb-4">Please login first</p>
          <Link to="/TeacherLogin" className="text-violet-400 hover:text-violet-300">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'courses', label: 'My Courses', icon: '📚' },
    { id: 'classes', label: 'Classes', icon: '🏫' },
    { id: 'students', label: 'My Students', icon: '👥' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'grades', label: 'Grade Book', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const stats = [
    { label: 'Active Courses', value: '4', icon: '📚', color: 'from-blue-500 to-indigo-500' },
    { label: 'Total Students', value: '118', icon: '👥', color: 'from-green-500 to-emerald-500' },
    { label: 'Pending Tasks', value: '12', icon: '⏰', color: 'from-yellow-500 to-orange-500' },
    { label: 'This Week', value: '3', icon: '📅', color: 'from-purple-500 to-pink-500' },
  ];

  const handleLogout = () => {
    navigate('/TeacherLogin');
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

            {/* Quick Actions & Recent */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" onClick={() => setActiveTab('courses')}>Manage Courses</Button>
                  <Button variant="secondary" onClick={() => setActiveTab('students')}>View Students</Button>
                  <Button variant="secondary" onClick={() => setActiveTab('assignments')}>Create Assignment</Button>
                  <Button variant="secondary" onClick={() => setActiveTab('grades')}>Update Grades</Button>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Assignments</h3>
                <div className="space-y-3">
                  {mockAssignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{assignment.title}</p>
                        <p className="text-gray-400 text-sm">{assignment.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-indigo-400 text-sm">{assignment.submissions}/30</p>
                        <p className="text-gray-500 text-xs">submitted</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">My Courses</h2>
              <Button>+ Add Course</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mockCourses.map((course) => (
                <div key={course.id} className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{course.name}</h3>
                      <p className="text-gray-400 text-sm">{course.schedule} • {course.room}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>👥 {course.students} students</span>
                      <span>📅 {course.schedule}</span>
                    </div>
                    <Button variant="secondary" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">My Students</h3>
                <p className="text-gray-400 text-sm">All enrolled students across courses</p>
              </div>
              <input
                type="text"
                placeholder="Search students..."
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Student Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-gray-300">{student.studentNumber}</td>
                      <td className="px-6 py-4 text-gray-300">{student.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${student.attendance}%` }}></div>
                          </div>
                          <span className="text-gray-400 text-sm">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="secondary" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Assignments</h2>
              <Button>+ Create Assignment</Button>
            </div>
            <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Assignment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Submissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-white font-medium">{assignment.title}</td>
                      <td className="px-6 py-4 text-gray-300">{assignment.course}</td>
                      <td className="px-6 py-4 text-gray-300">{assignment.dueDate}</td>
                      <td className="px-6 py-4 text-gray-300">{assignment.submissions}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm">View</Button>
                          <Button size="sm">Grade</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'classes':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Classes</h2>
            <p className="text-gray-400">Manage class sections from here.</p>
            <Button onClick={() => navigate('/ClassList')}>Manage Classes</Button>
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
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hover:text-indigo-300 transition-colors">Teacher Management System</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed top-16 inset-y-0 left-0 ${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-800/50 backdrop-blur-lg border-r border-white/10 z-40 transition-all duration-300`}>
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          {isSidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{name || 'Teacher'}</p>
                <p className="text-xs text-gray-400">{specialty}</p>
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
                      ? 'bg-violet-500/20 text-violet-400'
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
            <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
            <p className="text-gray-400 mt-1">ID: {id} | {specialty}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 bg-slate-800 rounded-xl text-gray-400 hover:text-white transition-colors">
              <span>🔔</span>
            </button>
            <button className="p-2 bg-slate-800 rounded-xl text-gray-400 hover:text-white transition-colors">
              <span>⚙️</span>
            </button>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default TeacherPanel;
