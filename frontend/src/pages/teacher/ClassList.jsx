import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetClassesQuery, useAddClassMutation, useDeleteClassMutation } from '../../RTK/userAPI';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Skeleton, { SkeletonCard } from '../../components/common/Skeleton';

const Icons = {
  ArrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

const ClassList = () => {
  const navigate = useNavigate();
  const { data: classes = [], isLoading, refetch } = useGetClassesQuery();
  const [addClass] = useAddClassMutation();
  const [deleteClass] = useDeleteClassMutation();
  const [newClassName, setNewClassName] = useState('');
  const [newClassDepartment, setNewClassDepartment] = useState('Computer Engineering');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  const departments = [
    'All',
    'Computer Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const filteredClasses = filterDepartment === 'All' 
    ? classes 
    : classes.filter(cls => cls.department === filterDepartment);

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setIsAdding(true);
    try {
      await addClass({ name: newClassName, department: newClassDepartment }).unwrap();
      setNewClassName('');
      refetch();
    } catch (error) {
      alert('Failed to add class');
    }
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      await deleteClass(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg h-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-slate-200 rounded-xl" />
                <div className="w-48 h-5 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} showImage={false} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Icons.Users />
              </div>
              <span className="text-lg font-semibold text-slate-700">Student Management System</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Classes</h1>
              <p className="text-slate-500 mt-1">Manage class sections</p>
            </div>
            <Link to="/TeacherPanel">
              <Button variant="secondary" size="sm">
                <span className="flex items-center gap-2"><Icons.ArrowLeft /> Back to Dashboard</span>
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                ))}
              </select>
            </div>
            <form onSubmit={handleAddClass} className="flex flex-col sm:flex-row gap-3">
              <select
                value={newClassDepartment}
                onChange={(e) => setNewClassDepartment(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              >
                {departments.filter(d => d !== 'All').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Enter class name..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
              <Button type="submit" disabled={isAdding || !newClassName.trim()}>
                <span className="flex items-center gap-2"><Icons.Plus /> {isAdding ? 'Adding...' : 'Add Class'}</span>
              </Button>
            </form>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <Card key={cls.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-800">{cls.name}</h3>
                  <p className="text-slate-500 text-sm">{cls.department} • ID: {cls.id}</p>
                </div>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Icons.Trash />
                </button>
              </Card>
            ))}
          </div>

          {classes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No classes found. Add one above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassList;