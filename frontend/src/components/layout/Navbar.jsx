import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-indigo-600">SMS</span>
              <span className="text-gray-700 font-medium">Student Management System</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/StudentList" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/StudentList') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Student Login
            </Link>
            <Link 
              to="/TeacherLogin" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/TeacherLogin') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Teacher Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
