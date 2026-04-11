import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTeacherLoginMutation } from '../../RTK/userAPI';

/* ─── Inline SVG icons ─── */
const Icons = {
  School: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Eye: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Spinner: () => (
    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
    </svg>
  ),
  Zap: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};

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
    if (localStorage.getItem('teacherData')) navigate('/TeacherPanel', { replace: true });
    const remembered = localStorage.getItem('rememberedTeacherEmail');
    if (remembered) { setEmail(remembered); setRememberMe(true); }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await login({ email, password }).unwrap();
      localStorage.setItem('teacherData', JSON.stringify({
        email: result.email, id: result.id, name: result.name, specialty: result.specialty,
      }));
      rememberMe
        ? localStorage.setItem('rememberedTeacherEmail', email)
        : localStorage.removeItem('rememberedTeacherEmail');
      navigate('/TeacherPanel');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => { setEmail('teacher1'); setPassword('pass1'); setError(''); };

  const inputBase = (hasError) =>
    `w-full px-3.5 py-2.5 bg-surface-50 border rounded-xl text-sm text-surface-700 placeholder-surface-400 focus:outline-none focus:ring-2 transition ${
      hasError
        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
        : 'border-surface-200 focus:ring-accent-500/30 focus:border-accent-400'
    }`;

  return (
    <div className="min-h-screen bg-surface-50 font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-surface-100 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white">
            <Icons.School />
          </div>
          <span className="text-sm font-semibold text-surface-700 tracking-tight">Student Management System</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/TeacherList" className="text-xs text-surface-400 hover:text-accent-600 transition-colors">
            View Teachers →
          </Link>
          <button onClick={() => navigate('/TeacherSignin')}
            className="text-xs font-medium text-surface-500 hover:text-accent-600 transition-colors">
            Register →
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="flex min-h-screen items-center justify-center px-4 pt-14">
        <div className="w-full max-w-[400px] py-12">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-100 text-accent-600 mb-5">
              <Icons.User />
            </div>
            <h1 className="text-2xl font-bold text-surface-800 tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-surface-400">Sign in to your teacher account</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Email address</label>
                <input type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="teacher@example.com" required
                  className={inputBase(!!error)} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••" required
                    className={`${inputBase(!!error)} pr-10`} />
                  <button type="button" tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors">
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2 pt-0.5">
                <input id="remember" type="checkbox" checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-surface-300 accent-accent-500 cursor-pointer" />
                <label htmlFor="remember" className="text-xs text-surface-500 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-100 rounded-xl">
                  <span className="text-red-400 shrink-0"><Icons.AlertCircle /></span>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full py-2.5 mt-1 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-accent-100">
                {isLoading ? <><Icons.Spinner /> Signing in…</> : 'Sign in'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-surface-50 text-center">
              <p className="text-xs text-surface-400">
                New teacher?{' '}
                <button onClick={() => navigate('/TeacherSignin')}
                  className="text-accent-600 hover:text-accent-700 font-semibold transition-colors">
                  Create an account
                </button>
              </p>
            </div>
          </div>

          {/* Demo credentials */}
          <button type="button" onClick={fillDemo}
            className="mt-3 w-full py-2.5 flex items-center justify-center gap-2 bg-white hover:bg-surface-50 border border-surface-200 rounded-xl text-xs text-surface-500 hover:text-surface-700 transition-all shadow-sm">
            <span className="text-amber-500"><Icons.Zap /></span>
            <span>Use demo credentials —</span>
            <span className="font-semibold text-accent-600">teacher1 / pass1</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;