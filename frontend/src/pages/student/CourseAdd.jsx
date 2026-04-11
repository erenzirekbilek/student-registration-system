import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAddCourseMutation, useGetClassesQuery, useGetTeachersQuery } from '../../RTK/userAPI';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Icons = {
  School: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  BookPlus: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="12" y1="6" x2="12" y2="14"/><line x1="8" y1="10" x2="16" y2="10"/>
    </svg>
  ),
};

const CourseAdd = () => {
  const navigate = useNavigate();
  const [addCourse] = useAddCourseMutation();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: teachers = [] } = useGetTeachersQuery();
  
  const teacherData = JSON.parse(localStorage.getItem('teacherData') || 'null');
  const isTeacher = !!teacherData;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacherId: teacherData?.id || '',
    classId: '',
    credit: '',
    schedule: '',
    room: '',
    status: 'active',
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
      navigate(isTeacher ? '/TeacherPanel' : '/');
    } catch (error) {
      alert('Failed to add course');
    }
    setIsLoading(false);
  };

  const inputBase = 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition';

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to={isTeacher ? '/TeacherPanel' : '/'} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white"><Icons.School /></span>
              </div>
              <span className="text-xl font-bold text-slate-700 hover:text-indigo-600 transition-colors">{isTeacher ? 'Teacher' : 'Student'} Management System</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center w-full px-4 pt-24 pb-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-2xl mb-4">
              <span className="text-indigo-600"><Icons.BookPlus /></span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Add New Course</h1>
            <p className="text-slate-400 mt-2">Fill in the details to create a new curriculum entry</p>
          </div>

          <Card className="bg-white border border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Introduction to Programming"
                    required
                    className={inputBase}
                  />
                </div>
                {isTeacher ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Teacher</label>
                    <input
                      type="text"
                      value={teacherData?.name || ''}
                      disabled
                      className={`${inputBase} opacity-60`}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Teacher <span className="text-red-400">*</span></label>
                    <select
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      required
                      className={inputBase}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Class <span className="text-red-400">*</span></label>
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Credits</label>
                  <input
                    type="number"
                    name="credit"
                    value={formData.credit}
                    onChange={handleChange}
                    placeholder="4"
                    required
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Schedule</label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    placeholder="Mon/Wed 10:00 AM"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Room</label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="Room 101"
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description..."
                  rows={3}
                  className={`${inputBase} resize-none`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
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