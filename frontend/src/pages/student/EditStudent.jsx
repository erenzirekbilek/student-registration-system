import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';

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

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hover:text-indigo-300 transition-colors">
                Student Management System
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-8 px-4 pt-20">
        <div className="max-w-2xl mx-auto">
          <Link
            to="-1"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowBackIcon className="w-5 h-5 mr-2" />
            <span>Back to List</span>
          </Link>

          <Card title="Edit Student" className="bg-slate-800/50 backdrop-blur-xl border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Student Number"
                  name="studentNumber"
                  value={formData.studentNumber}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Major <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Major</option>
                    {majors.map((major) => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Academic Year
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select academic year</option>
                    {academicYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
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