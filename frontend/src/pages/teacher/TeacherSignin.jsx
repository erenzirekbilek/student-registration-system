import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAddTeacherMutation } from '../../RTK/userAPI';

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
};

const TeacherSignin = () => {
  const navigate = useNavigate();
  const [addTeacher] = useAddTeacherMutation();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', specialty: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await addTeacher(formData).unwrap();
      navigate('/TeacherLogin');
    } catch {
      setError('Registration failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition';

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-slate-100 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Icons.School />
          </div>
          <span className="text-sm font-semibold text-slate-700 tracking-tight">Student Management System</span>
        </Link>
        <div className="ml-auto">
          <Link to="/TeacherLogin" className="text-xs font-medium text-slate-500 hover:text-violet-600 transition-colors">
            Sign in instead →
          </Link>
        </div>
      </nav>

      {/* Page body */}
      <div className="flex min-h-screen items-center justify-center px-4 pt-14">
        <div className="w-full max-w-[480px] py-12">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 mb-5">
              <Icons.User />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-slate-400">Register as a teacher to get started</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Full name */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Full name</label>
                  <input name="name" value={formData.name} onChange={handleChange}
                    placeholder="Dr. John Smith" required className={inputBase} />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Email address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="john@university.edu" required className={inputBase} />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password"
                      value={formData.password} onChange={handleChange}
                      placeholder="••••••••" required className={`${inputBase} pr-10`} />
                    <button type="button" tabIndex={-1}
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Specialty</label>
                  <input name="specialty" value={formData.specialty} onChange={handleChange}
                    placeholder="Computer Science" required className={inputBase} />
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Phone <span className="text-slate-300 font-normal">(optional)</span>
                  </label>
                  <input name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+1 234 567 890" className={inputBase} />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-rose-50 border border-rose-100 rounded-xl">
                  <span className="text-rose-400 shrink-0"><Icons.AlertCircle /></span>
                  <p className="text-xs text-rose-600">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full py-2.5 mt-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                {isLoading ? <><Icons.Spinner /> Creating account…</> : 'Create account'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-slate-50 text-center">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button onClick={() => navigate('/TeacherLogin')}
                  className="text-violet-600 hover:text-violet-700 font-semibold transition-colors">
                  Sign in
                </button>
              </p>
            </div>
          </div>

          {/* Fine print */}
          <p className="text-center text-[11px] text-slate-400 mt-5">
            By creating an account you agree to our{' '}
            <span className="text-slate-500 underline underline-offset-2 cursor-pointer hover:text-violet-600 transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-slate-500 underline underline-offset-2 cursor-pointer hover:text-violet-600 transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignin;