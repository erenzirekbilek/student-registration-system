import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// İkonları StudentLogin'deki gibi kompakt hale getirdik
const Icons = {
  School: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )
};

const Home = () => {
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const studentData = localStorage.getItem('studentData');
    const teacherData = localStorage.getItem('teacherData');
    if (studentData) setRedirectTo('/StudentPanel');
    else if (teacherData) setRedirectTo('/TeacherPanel');
  }, []);

  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <div className="min-h-screen bg-surface-50 font-sans selection:bg-primary-100">
      {/* Navbar - StudentLogin ile aynı hizada (h-14) */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-white/80 backdrop-blur-md border-b border-surface-100 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/icons.png" alt="SMS Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-primary-500/20" />
          <span className="text-sm font-semibold text-surface-700 tracking-tight text-[13px] sm:text-sm">
            Student Management System
          </span>
        </Link>
      </nav>

      {/* Hero & Content */}
      <div className="pt-28 pb-20 px-4 max-w-5xl mx-auto">
        {/* Header - Yazı boyutları küçültüldü */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-primary-50 border border-primary-100 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
            <span className="text-primary-600 text-[11px] font-bold uppercase tracking-widest">Platform v2.0 Online</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-surface-800 tracking-tight mb-4">
            Academic Management <span className="text-primary-600">Simplified.</span>
          </h1>
          <p className="text-sm text-surface-400 max-w-lg mx-auto leading-relaxed">
            Manage students, courses, and academic processes with our streamlined interface designed for efficiency.
          </p>
        </div>

        {/* Portal Cards - Daha sıkı ve kompakt */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link to="/StudentLogin" 
            className="group bg-white p-6 rounded-2xl border border-surface-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <Icons.School />
              </div>
              <h2 className="text-base font-bold text-surface-800 mb-2">Student Portal</h2>
              <p className="text-[13px] text-surface-400 leading-relaxed mb-6 px-4">
                Access your grades, attendance, and course materials instantly.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-600 uppercase tracking-wider">
                Enter Portal <Icons.ArrowRight />
              </div>
            </div>
          </Link>

          <Link to="/TeacherLogin" 
            className="group bg-white p-6 rounded-2xl border border-surface-100 shadow-sm hover:shadow-xl hover:border-accent-200 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent-50 text-accent-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent-600 group-hover:text-white transition-all">
                <Icons.User />
              </div>
              <h2 className="text-base font-bold text-surface-800 mb-2">Teacher Portal</h2>
              <p className="text-[13px] text-surface-400 leading-relaxed mb-6 px-4">
                Manage your classes, grade students, and track academic growth.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent-600 uppercase tracking-wider">
                Dashboard <Icons.ArrowRight />
              </div>
            </div>
          </Link>
        </div>

        {/* Stats - Küçük ve kompakt kutular */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Students', value: '10K+' },
            { label: 'Courses', value: '450+' },
            { label: 'Staff', value: '200+' },
            { label: 'Uptime', value: '99.9%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-surface-100 p-4 rounded-xl text-center shadow-sm">
              <div className="text-lg font-bold text-surface-800">{stat.value}</div>
              <div className="text-[10px] font-bold text-surface-400 uppercase tracking-tighter">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - Basitleştirilmiş */}
      <footer className="border-t border-surface-100 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[11px] font-medium text-surface-400 uppercase tracking-widest">
            © 2024 SMS Platform. Efficient Academic Solutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;