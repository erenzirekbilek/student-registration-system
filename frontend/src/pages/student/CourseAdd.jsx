import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAddCourseMutation, useGetClassesQuery, useGetTeachersQuery } from '../../RTK/userAPI';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SchoolIcon from '@mui/icons-material/School';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

const CourseAdd = () => {
  const navigate = useNavigate();
  const [addCourse] = useAddCourseMutation();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: teachers = [] } = useGetTeachersQuery();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacherId: '',
    classId: '',
    credit: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addCourse(formData).unwrap();
      alert('Course added successfully!');
      navigate('/TeacherPanel');
    } catch (error) {
      alert('Failed to add course');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden bg-slate-900">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hover:text-indigo-300 transition-colors">Student Management System</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 pt-24 pb-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
              <LibraryAddIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Add New Course</h1>
            <p className="text-gray-400 mt-2">Fill in the details to create a new curriculum entry</p>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-xl border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Course Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Introduction to Programming"
                  required
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Teacher <span className="text-red-400">*</span></label>
                  <select
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Class <span className="text-red-400">*</span></label>
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Credits"
                  name="credit"
                  type="number"
                  value={formData.credit}
                  onChange={handleChange}
                  placeholder="4"
                  required
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => navigate(-1)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-8 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/20"
                >
                  {isLoading ? 'Adding...' : 'Add Course'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseAdd;