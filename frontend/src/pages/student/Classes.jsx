import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGetCoursesQuery, useGetCoursesByClassQuery } from '../../RTK/userAPI';
import Button from '../../components/common/Button';
import SchoolIcon from '@mui/icons-material/School';

const Classes = () => {
  const location = useLocation();
  const { classId } = location.state || {};
  const { data: courses = [], isLoading } = classId ? useGetCoursesByClassQuery(classId) : useGetCoursesQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hover:text-indigo-300 transition-colors">Student Management System</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">My Classes</h1>
              <p className="text-gray-400 mt-1">View and manage your enrolled courses</p>
            </div>
            <Link to="/StudentPanel">
              <Button variant="secondary">← Back to Dashboard</Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search courses by name or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <div key={course.id} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className={`h-2 bg-gradient-to-r ${colors[index % colors.length]}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{course.name}</h3>
                      <p className="text-gray-400 text-sm">{course.description || 'No description'}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-full">
                      {course.credit || 0} CR
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1">Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-gray-500 text-lg">No courses found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;