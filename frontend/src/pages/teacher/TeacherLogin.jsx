import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTeacherLoginMutation } from '../../RTK/userAPI';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [login] = useTeacherLoginMutation();

  useEffect(() => {
    const teacherData = localStorage.getItem('teacherData');
    if (teacherData) {
      navigate('/TeacherPanel', { replace: true });
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
        specialty: result.specialty,
      });
      localStorage.setItem('teacherData', userData);
      if (rememberMe) {
        localStorage.setItem('rememberedTeacherEmail', email);
      } else {
        localStorage.removeItem('rememberedTeacherEmail');
      }
      navigate('/TeacherPanel');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('teacher1');
    setPassword('pass1');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 border-b border-white/[0.06] bg-surface-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <SchoolIcon style={{ fontSize: 18 }} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">
              Student Management System
            </span>
          </Link>
        </div>
      </nav>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -transurface-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-14">
        <div className="w-full max-w-[380px] py-16">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 mb-5">
              <PeopleAltIcon style={{ fontSize: 22 }} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h1>
            <p className="mt-1.5 text-sm text-surface-400">Enter your credentials to continue</p>
          </div>

          {/* Card */}
          <div className="bg-surface-900 border border-white/[0.08] rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="teacher@example.com"
                  required
                  className={`w-full h-10 px-3 rounded-lg bg-surface-800 border text-sm text-white placeholder-surface-500 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500 ${
                    error ? 'border-red-500/60' : 'border-white/[0.08]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    required
                    className={`w-full h-10 px-3 pr-10 rounded-lg bg-surface-800 border text-sm text-white placeholder-surface-500 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500 ${
                      error ? 'border-red-500/60' : 'border-white/[0.08]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -transurface-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <VisibilityOffIcon style={{ fontSize: 16 }} />
                      : <VisibilityIcon style={{ fontSize: 16 }} />
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
                  className="w-3.5 h-3.5 rounded border-surface-600 bg-surface-800 accent-violet-500 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-surface-400 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-red-400 text-xs">⚠</span>
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 mt-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
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

            <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
              <p className="text-xs text-surface-500">
                New teacher?{' '}
                <button
                  onClick={() => navigate('/TeacherSignin')}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Register here
                </button>
              </p>
              <Link
                to="/TeacherList"
                className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
              >
                View Teachers →
              </Link>
            </div>
          </div>

          {/* Demo */}
          <button
            type="button"
            onClick={fillDemo}
            className="mt-3 w-full h-9 flex items-center justify-center gap-1.5 bg-surface-900 hover:bg-surface-800 border border-white/[0.06] rounded-xl text-xs text-surface-500 hover:text-surface-300 transition-all"
          >
            <span>Use demo credentials</span>
            <span className="text-violet-400 font-medium">teacher1 / pass1</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;