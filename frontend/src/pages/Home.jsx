import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SchoolIcon, UserIcon, ArrowForwardIcon } from '../components/common/Icons';

const Home = () => {
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const studentData = localStorage.getItem('studentData');
    const teacherData = localStorage.getItem('teacherData');

    if (studentData) {
      setRedirectTo('/StudentPanel');
    } else if (teacherData) {
      setRedirectTo('/TeacherPanel');
    }
  }, []);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-50 to-accent-50 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-surface-100 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <SchoolIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-800 group-hover:text-primary-600 transition-colors">Student Management System</span>
            </Link>
            <div className="flex items-center space-x-4">

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-primary-600 text-sm font-medium">Academic Management Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-surface-900 mb-6 tracking-tight font-display">
            Student Management
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"> System</span>
          </h1>
          <p className="text-xl text-surface-500 max-w-2xl mx-auto leading-relaxed">
            A comprehensive platform for managing students, courses, and academic processes efficiently. 
            Streamline your educational workflow today.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link 
            to="/StudentLogin"
            className="group relative bg-white rounded-3xl p-8 border border-surface-100 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-100 group-hover:scale-110 transition-transform duration-300">
                <SchoolIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-surface-800 mb-3 font-display">Student Portal</h2>
              <p className="text-surface-500 text-center mb-6">
                Access course materials, view grades, check attendance, and track your academic progress.
              </p>
              <div className="flex items-center text-primary-500 font-medium group-hover:text-primary-600 transition-colors">
                <span>Enter Portal</span>
                <ArrowForwardIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link 
            to="/TeacherLogin"
            className="group relative bg-white rounded-3xl p-8 border border-surface-100 shadow-sm hover:shadow-lg hover:border-accent-200 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent-100 group-hover:scale-110 transition-transform duration-300">
                <UserIcon className="w-12 h-12 text-white" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-surface-800 mb-3 font-display">Teacher Portal</h2>
              <p className="text-surface-500 text-center mb-6">
                Create courses, manage assignments, track student progress, and manage your academic responsibilities.
              </p>
              <div className="flex items-center text-accent-500 font-medium group-hover:text-accent-600 transition-colors">
                <span>Enter Portal</span>
                <ArrowForwardIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { label: 'Students', value: '10,000+' },
            { label: 'Courses', value: '500+' },
            { label: 'Teachers', value: '200+' },
            { label: 'Campuses', value: '50+' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-2xl border border-surface-100 shadow-sm">
              <div className="text-3xl font-bold text-surface-800 mb-1 font-display">{stat.value}</div>
              <div className="text-surface-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-surface-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-surface-400">© 2024 Student Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;