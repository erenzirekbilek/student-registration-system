import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGetCoursesQuery, useGetCoursesByClassQuery } from '../../RTK/userAPI';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Icons = {
  ArrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
};

const Classes = () => {
  const location = useLocation();
  const { classId } = location.state || {};
  const { data: courses = [], isLoading } = classId ? useGetCoursesByClassQuery(classId) : useGetCoursesQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const colors = [
    { bg: '#eff6ff', text: '#2563eb', border: '#dbeafe' },
    { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' },
    { bg: '#faf5ff', text: '#9333ea', border: '#f3e8ff' },
    { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5' },
    { bg: '#fdf2f8', text: '#db2777', border: '#fce7f3' },
    { bg: '#eef2ff', text: '#4f46e5', border: '#e0e7ff' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold"><Icons.BookOpen /></span>
              </div>
              <span className="text-lg font-semibold text-slate-700">Student Management System</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">My Classes</h1>
              <p className="text-slate-500 mt-1">View and manage your enrolled courses</p>
            </div>
            <Link to="/StudentPanel">
              <Button variant="secondary" size="sm">
                <span className="flex items-center gap-2"><Icons.ArrowLeft /> Back to Dashboard</span>
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icons.Search />
              </span>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, index) => {
              const color = colors[index % colors.length];
              return (
                <Card key={course.id} className="hover:shadow-lg transition-all duration-300">
                  <div className={`h-1.5 bg-gradient-to-r ${['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600', 'from-indigo-500 to-indigo-600'][index % 6]}`}></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 text-base">{course.name}</h3>
                        <p className="text-slate-500 text-sm mt-0.5">{course.description || 'No description'}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${color.bg} ${color.text}`}>
                        {course.credit || 0} CR
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-slate-100">
                      {course.teacherId && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Icons.User />
                          <span>Teacher ID: {course.teacherId}</span>
                        </div>
                      )}
                      {course.schedule && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Icons.Clock />
                          <span>{course.schedule}</span>
                        </div>
                      )}
                      {course.room && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Icons.MapPin />
                          <span>{course.room}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icons.Search />
              </div>
              <p className="text-slate-500">No courses found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;