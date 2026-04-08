import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAddStudentMutation, useGetClassesQuery } from '../../RTK/userAPI';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
      await addStudent(formData).unwrap();
      navigate('/StudentLogin');
    } catch (err) {
      setError('Registration failed. Email might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = 'w-full h-10 px-3 rounded-lg bg-slate-800 border border-white/[0.08] text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
  const labelClass = 'block text-xs font-medium text-slate-400 mb-1.5';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-14">
        <div className="w-full max-w-[480px] py-12">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-5">
              <SchoolIcon style={{ fontSize: 22 }} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-slate-400">Fill in the details below to register</p>
          </div>

          {/* Card */}
          <div className="bg-slate-900 border border-white/[0.08] rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@university.edu"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword
                        ? <VisibilityOffIcon style={{ fontSize: 16 }} />
                        : <VisibilityIcon style={{ fontSize: 16 }} />
                      }
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone <span className="text-slate-600">(optional)</span></label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Class
                  </label>
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">Select a class</option>
                    {classes?.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
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
                className="w-full h-10 mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/StudentLogin')}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
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