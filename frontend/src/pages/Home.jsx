import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-slate-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hover:text-indigo-300 transition-colors">Student Management System</span>
            </Link>
            <div className="flex items-center space-x-4">

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            <span className="text-indigo-300 text-sm font-medium">Academic Management Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Student Management
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent"> System</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A comprehensive platform for managing students, courses, and academic processes efficiently. 
            Streamline your educational workflow today.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link 
            to="/StudentLogin"
            className="group relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                <SchoolIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Student Portal</h2>
              <p className="text-gray-400 text-center mb-6">
                Access course materials, view grades, check attendance, and track your academic progress.
              </p>
              <div className="flex items-center text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">
                <span>Enter Portal</span>
                <ArrowForwardIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link 
            to="/TeacherLogin"
            className="group relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-violet-500/50 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                <PeopleAltIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Teacher Portal</h2>
              <p className="text-gray-400 text-center mb-6">
                Create courses, manage assignments, track student progress, and manage your academic responsibilities.
              </p>
              <div className="flex items-center text-violet-400 font-medium group-hover:text-violet-300 transition-colors">
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
            <div key={i} className="text-center p-6 bg-slate-800/30 rounded-2xl border border-white/5">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-900/80 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">© 2024 Student Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;