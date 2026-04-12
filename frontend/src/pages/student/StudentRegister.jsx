import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAddStudentMutation, useGetClassesQuery } from '../../RTK/userAPI';
import { SchoolIcon, EyeIcon, EyeOffIcon } from '../../components/common/Icons';

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

  const inputClass = 'w-full h-10 px-3 rounded-lg bg-surface-50 border border-surface-200 text-sm text-surface-800 placeholder-surface-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';
  const labelClass = 'block text-xs font-medium text-surface-600 mb-1.5';

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
        <div className="w-full max-w-[480px] py-12">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 mb-5 shadow-lg shadow-primary-100">
              <SchoolIcon style={{ fontSize: 22 }} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-800 tracking-tight font-display">Create your account</h1>
            <p className="mt-1.5 text-sm text-surface-500">Fill in the details below to register</p>
          </div>

          {/* Card */}
          <div className="bg-white border border-surface-100 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="student@example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Class</label>
                <select name="classId" value={formData.classId} onChange={handleChange} required className={inputClass}>
                  <option value="">Select a class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-red-500 text-xs">⚠</span>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}
              <button type="submit" disabled={isLoading} className="w-full h-10 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-primary-100">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <div className="mt-6 pt-5 border-t border-surface-100 text-center">
              <p className="text-xs text-surface-400">
                Already have an account?{' '}
                <button onClick={() => navigate('/StudentLogin')} className="text-primary-500 hover:text-primary-600 font-medium">
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