import { Link, useLocation } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-surface-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <SchoolIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-800 group-hover:text-primary-600 transition-colors">
              SMS
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/StudentLogin" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/StudentLogin') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
              }`}
            >
              Student
            </Link>
            <Link 
              to="/TeacherLogin" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/TeacherLogin') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
              }`}
            >
              Teacher
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;