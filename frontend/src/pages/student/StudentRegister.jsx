import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAddStudentMutation, useGetClassesQuery } from '../../RTK/userAPI';

const Icons = {
  School: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  UserPlus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

const inputBase = (hasError) =>
  `w-full px-4 py-3 bg-white border rounded-xl text-sm text-surface-800 placeholder-surface-400 focus:outline-none transition-all ${
    hasError
      ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-400'
      : 'border-surface-200 hover:border-surface-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400'
  }`;

const StudentRegister = () => {
  const navigate = useNavigate();
  const [addStudent] = useAddStudentMutation();
  const { data: classes = [] } = useGetClassesQuery();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    classId: '',
  });
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
      await addStudent({
        ...formData,
        classId: formData.classId ? Number(formData.classId) : null
      }).unwrap();
      navigate('/StudentLogin');
    } catch (err) {
      setError(err.data?.message || 'Registration failed. Email might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-white/80 backdrop-blur-md border-b border-surface-100 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
            <Icons.School />
          </div>
          <span className="text-sm font-semibold text-surface-700 tracking-tight">Student Management System</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/TeacherList" className="text-xs text-surface-400 hover:text-primary-600 transition-colors">
            Teachers →
          </Link>
          <button onClick={() => navigate('/TeacherSignin')}
            className="text-xs font-medium text-surface-500 hover:text-primary-600 transition-colors">
            Teacher? →
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="flex min-h-screen items-center justify-center px-4 pt-14">
        <div className="w-full max-w-[400px] py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-5 shadow-lg shadow-primary-500/30">
              <Icons.UserPlus />
            </div>
            <h1 className="text-2xl font-bold text-surface-800 tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-surface-400">Fill in the details below to register</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-surface-100 shadow-xl shadow-surface-100/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wider">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={inputBase(!!error)} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wider">Email address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="student@example.com" className={inputBase(!!error)} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className={`${inputBase(!!error)} pr-12`} />
                  <button type="button" tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors p-1">
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wider">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" className={inputBase(false)} />
              </div>

              {/* Class */}
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wider">Class</label>
                <select name="classId" value={formData.classId} onChange={handleChange} required className={inputBase(false)}>
                  <option value="">Select a class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                  <span className="text-red-500 shrink-0"><Icons.AlertCircle /></span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-primary-500/25">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : 'Create Account'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-surface-50 text-center">
              <p className="text-sm text-surface-400">
                Already have an account?{' '}
                <button onClick={() => navigate('/StudentLogin')}
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;