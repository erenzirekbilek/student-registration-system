import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAddCourseMutation, useGetClassesQuery, useGetTeachersQuery } from '../../RTK/userAPI';

const Icons = {
  School: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  BookPlus: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="12" y1="7" x2="12" y2="15" /><line x1="8" y1="11" x2="16" y2="11" />
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
};

const inputBase = "w-full px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200";
const labelBase = "block text-[11px] font-bold text-surface-500 mb-1.5 uppercase tracking-wider";

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
      navigate(isTeacher ? '/TeacherPanel' : '/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-white/80 backdrop-blur-md border-b border-surface-100 flex items-center px-6">
        <Link to={isTeacher ? '/TeacherPanel' : '/'} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
            <Icons.School />
          </div>
          <span className="text-sm font-semibold text-surface-700 tracking-tight">
            {isTeacher ? 'Teacher' : 'Student'} Management System
          </span>
        </Link>
      </nav>

      {/* Decorative Blur */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 pt-20 pb-12 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-primary-600 mb-5 shadow-xl shadow-surface-200/50 border border-surface-50">
              <Icons.BookPlus />
            </div>
            <h1 className="text-2xl font-bold text-surface-800 tracking-tight">Add New Course</h1>
            <p className="mt-2 text-sm text-surface-400">Create a new curriculum entry for the semester</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-surface-100 shadow-2xl shadow-surface-200/60 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Name */}
                <div className="md:col-span-2">
                  <label className={labelBase}>Course Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Advanced JavaScript Patterns"
                    required
                    className={inputBase}
                  />
                </div>

                {/* Teacher Selection */}
                <div>
                  <label className={labelBase}>Assigned Teacher</label>
                  {isTeacher ? (
                    <div className={`${inputBase} bg-surface-50 text-surface-500 flex items-center gap-2 border-dashed`}>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {teacherData?.name || 'Logged in Teacher'}
                    </div>
                  ) : (
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
                  )}
                </div>

                {/* Class Selection */}
                <div>
                  <label className={labelBase}>Target Class <span className="text-primary-500">*</span></label>
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

                {/* Credits */}
                <div>
                  <label className={labelBase}>Credits</label>
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

                {/* Room */}
                <div>
                  <label className={labelBase}>Lecture Room</label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="Lab 402"
                    className={inputBase}
                  />
                </div>

                {/* Schedule */}
                <div className="md:col-span-2">
                  <label className={labelBase}>Weekly Schedule</label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    placeholder="Monday & Wednesday, 10:00 - 12:00"
                    className={inputBase}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className={labelBase}>Course Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Briefly describe the learning objectives..."
                    rows={3}
                    className={`${inputBase} resize-none`}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 text-sm font-semibold text-surface-500 hover:text-surface-700 hover:bg-surface-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/25 disabled:opacity-70 transition-all flex items-center gap-2"
                >
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAdd;