import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGetCoursesQuery, useGetCoursesByClassQuery } from '../../RTK/userAPI';
import Button from '../../components/common/Button';

const Icons = {
  School: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
};

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
    { bg: '#eff6ff', text: '#2563eb' },
    { bg: '#f0fdf4', text: '#16a34a' },
    { bg: '#faf5ff', text: '#9333ea' },
    { bg: '#fff7ed', text: '#ea580c' },
    { bg: '#fdf2f8', text: '#db2777' },
    { bg: '#eef2ff', text: '#4f46e5' },
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold"><Icons.School /></span>
              </div>
              <span className="text-xl font-bold text-slate-700 hover:text-indigo-600 transition-colors">Student Management System</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">My Classes</h1>
              <p className="text-slate-400 mt-1">View and manage your enrolled courses</p>
            </div>
            <Link to="/StudentPanel">
              <Button variant="secondary">← Back to Dashboard</Button>
            </Link>
          </div>

          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></span>
              <input
                type="text"
                placeholder="Search courses by name or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-96 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => {
              const color = colors[index % colors.length];
              return (
                <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all hover:-translate-y-1">
                  <div className={`h-1.5 bg-gradient-to-r ${['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600', 'from-indigo-500 to-indigo-600'][index % 6]}`}></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{course.name}</h3>
                        <p className="text-slate-400 text-sm mt-0.5">{course.description || 'No description'}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${color.bg} ${color.text}`}>
                        {course.credit || 0} CR
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1">Details</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icons.Search />
              </div>
              <p className="text-slate-500 text-lg">No courses found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;