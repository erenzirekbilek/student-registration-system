import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AccountDropdown = ({ userData, userType, isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (userType === 'student') {
      localStorage.removeItem('studentData');
    } else if (userType === 'teacher') {
      localStorage.removeItem('teacherData');
    }
    window.location.reload();
  };

  const initials = userData?.name
    ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : isLoggedIn ? 'U' : 'G';

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-50 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
          {initials}
        </div>
        <svg
          className={`w-4 h-4 text-surface-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-100 py-2 z-50">
          {isLoggedIn ? (
            <>
              <div className="px-4 py-3 border-b border-surface-100">
                <p className="text-sm font-medium text-surface-800">{userData?.name || 'User'}</p>
                <p className="text-xs text-surface-400 mt-0.5">{userData?.email || 'user@email.com'}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => navigate(`/${userType}/settings`)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Account Settings
                </button>
                <button
                  onClick={() => navigate(`/${userType}/profile`)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
              </div>
              <div className="border-t border-surface-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <button
                onClick={() => navigate('/StudentLogin')}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Student Login
              </button>
              <button
                onClick={() => navigate('/TeacherLogin')}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Teacher Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

AccountDropdown.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  userType: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};

export default AccountDropdown;