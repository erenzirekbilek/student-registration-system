import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Icons = {
  School: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
};

const mockStudent = {
  id: 1,
  name: 'John Doe',
  email: 'student@example.com',
  studentNumber: 'STU001',
  phone: '+1 234 567 890',
  address: '123 Main St, City, Country',
  major: 'Computer Engineering',
  academicYear: '2024-2025',
};

const majors = [
  'Computer Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Software Engineering',
  'Information Systems',
  'Computer Science',
  'Data Science',
  'Artificial Intelligence',
  'Biomedical Engineering',
  'Environmental Engineering',
];

const EditStudent = () => {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const academicYears = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    academicYears.push(`${i}-${i + 1}`);
  }

  const [formData, setFormData] = useState(mockStudent);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log('Updated student data:', formData);
      alert('Student updated successfully!');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition';

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white"><Icons.School /></span>
              </div>
              <span className="text-xl font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                Student Management System
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 pt-20">
        <div className="max-w-2xl mx-auto">
          <Link
            to="-1"
            className="inline-flex items-center text-slate-400 hover:text-indigo-600 mb-6 transition-colors"
          >
            <span className="mr-2"><Icons.ArrowLeft /></span>
            <span>Back to List</span>
          </Link>

          <Card className="bg-white border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Edit Student</h2>
              <p className="text-xs text-slate-400 mt-1">Update the student's information below</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Student Number</label>
                  <input
                    type="text"
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Major <span className="text-red-400">*</span></label>
                  <select
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  >
                    <option value="">Select Major</option>
                    {majors.map((major) => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Academic Year</label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">Select academic year</option>
                    {academicYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Student'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;