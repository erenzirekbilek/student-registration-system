import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetClassesQuery, useAddClassMutation, useDeleteClassMutation } from '../../RTK/userAPI';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Skeleton, { SkeletonCard } from '../../components/common/Skeleton';
import { SchoolIcon, AddIcon, DeleteIcon } from '../../components/common/Icons';

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
      <div className="min-h-screen bg-surface-50 font-sans">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-100 bg-white/80 backdrop-blur-lg h-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-surface-200 rounded-xl" />
                <div className="w-48 h-5 bg-surface-200 rounded" />
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} showImage={false} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-100 bg-white/80 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-800 hover:text-primary-600 transition-colors">Student Management System</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-surface-800 font-display">Classes</h1>
              <p className="text-surface-500 mt-1">Manage class sections</p>
            </div>
            <Link to="/TeacherPanel">
              <Button variant="secondary">← Back to Dashboard</Button>
            </Link>
          </div>

          {/* Filter and Add Class */}
          <Card className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                ))}
              </select>
            </div>
            <form onSubmit={handleAddClass} className="flex flex-col sm:flex-row gap-4">
              <select
                value={newClassDepartment}
                onChange={(e) => setNewClassDepartment(e.target.value)}
                className="px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {departments.filter(d => d !== 'All').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Enter class name (e.g., Computer Science 2024)"
                className="flex-1 px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-700 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <Button type="submit" disabled={isAdding || !newClassName.trim()}>
                <AddIcon className="w-5 h-5 mr-1" />
                {isAdding ? 'Adding...' : 'Add Class'}
              </Button>
            </form>
          </Card>

          {/* Classes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="bg-white rounded-xl p-4 border border-surface-100 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-surface-800">{cls.name}</h3>
                  <p className="text-surface-500 text-sm">{cls.department} • Class ID: {cls.id}</p>
                </div>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <DeleteIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {classes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-surface-400 text-lg">No classes found. Add one above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassList;