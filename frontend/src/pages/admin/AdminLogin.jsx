import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Student Login temasındaki ikon yapısı
const Icons = {
  School: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const inputBase = (hasError) =>
  `w-full px-4 py-3 bg-white border rounded-xl text-sm text-surface-800 placeholder-surface-400 focus:outline-none transition-all ${hasError
    ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-400'
    : 'border-surface-200 hover:border-surface-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400'
  }`;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Oturum kontrolü
  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminData', JSON.stringify(data));
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-white/80 backdrop-blur-md border-b border-surface-100 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/25">
            <Icons.School />
          </div>
          <span className="text-sm font-semibold text-surface-700 tracking-tight">Student Management System</span>
        </Link>
      </nav>

      {/* Decorative Background Element */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-100/40 rounded-full blur-[120px]" />
      </div>

      {/* Body */}
      <div className="flex min-h-screen items-center justify-center px-4 pt-14 relative z-10">
        <div className="w-full max-w-[400px] py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white mb-5 shadow-lg shadow-primary-600/30">
              <Icons.Shield />
            </div>
            <h1 className="text-2xl font-bold text-surface-800 tracking-tight">Admin Portal</h1>
            <p className="mt-2 text-sm text-surface-400">Secure access for administrators</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-surface-100 shadow-xl shadow-surface-100/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wider">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@system.com"
                  required
                  className={inputBase(!!error)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    required
                    className={`${inputBase(!!error)} pr-12`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors p-1"
                  >
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                  <span className="text-red-500 shrink-0"><Icons.AlertCircle /></span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-primary-600/25"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : 'Authenticate'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-surface-50 text-center">
              <Link to="/login" className="text-sm text-surface-400 hover:text-primary-600 transition-colors">
                Return to Student Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}