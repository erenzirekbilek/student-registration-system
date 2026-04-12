import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudentLoginMutation } from '../../RTK/userAPI';
import { SchoolIcon, EyeIcon, EyeOffIcon } from '../../components/common/Icons';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [login] = useStudentLoginMutation();

  useEffect(() => {
    const studentData = localStorage.getItem('studentData');
    if (studentData) {
      navigate('/StudentPanel', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await login({ email, password }).unwrap();
      const userData = JSON.stringify({ 
        email: result.email, 
        id: result.id, 
        name: result.name,
        studentNumber: result.studentNumber,
        classId: result.classId,
        attendance: result.attendance,
        grade: result.grade
      });
      localStorage.setItem('studentData', userData);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      navigate('/StudentPanel');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('student@example.com');
    setPassword('123');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 border-b border-surface-100 bg-white backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <SchoolIcon style={{ fontSize: 18 }} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-surface-800 tracking-tight">
              Student Management System
            </span>
          </Link>
        </div>
      </nav>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-100 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-14">
        <div className="w-full max-w-[380px] py-16">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 mb-5 shadow-lg shadow-primary-100">
              <SchoolIcon style={{ fontSize: 22 }} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-800 tracking-tight font-display">Sign in to your account</h1>
            <p className="mt-1.5 text-sm text-surface-500">Enter your credentials to continue</p>
          </div>

          {/* Card */}
          <div className="bg-white border border-surface-100 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="student@example.com"
                  required
                  className={`w-full h-10 px-3 rounded-lg bg-surface-50 border border-surface-200 text-sm text-surface-800 placeholder-surface-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                    error ? 'border-red-500/60' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    required
                    className={`w-full h-10 px-3 pr-10 rounded-lg bg-surface-50 border border-surface-200 text-sm text-surface-800 placeholder-surface-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                      error ? 'border-red-500/60' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <EyeOffIcon size={16} />
                      : <EyeIcon size={16} />
                    }
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-surface-300 bg-surface-50 accent-primary-500 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-surface-500 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-red-500 text-xs leading-none">⚠</span>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 mt-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-primary-100"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-surface-100 text-center">
              <p className="text-xs text-surface-400">
                Don&apos;t have an account?{' '}
                <button onClick={() => navigate('/StudentRegister')} className="text-primary-500 hover:text-primary-600 font-medium transition-colors">
                  Register here
                </button>
              </p>
            </div>
          </div>

          {/* Demo */}
          <button
            type="button"
            onClick={fillDemo}
            className="mt-3 w-full h-9 flex items-center justify-center gap-1.5 bg-surface-50 hover:bg-surface-100 border border-surface-200 rounded-xl text-xs text-surface-500 hover:text-surface-700 transition-all"
          >
            <span>Use demo credentials</span>
            <span className="text-primary-500 font-medium">student@example.com / 123</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;