import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetClassesQuery, useAddClassMutation, useDeleteClassMutation } from '../../RTK/userAPI';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SchoolIcon from '@mui/icons-material/School';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ClassList = () => {
  const navigate = useNavigate();
  const { data: classes = [], isLoading } = useGetClassesQuery();
  const [addClass] = useAddClassMutation();
  const [deleteClass] = useDeleteClassMutation();
  const [newClassName, setNewClassName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setIsAdding(true);
    try {
      await addClass({ name: newClassName }).unwrap();
      setNewClassName('');
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
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900">
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

      <div className="py-8 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Classes</h1>
              <p className="text-gray-400 mt-1">Manage class sections</p>
            </div>
            <Link to="/TeacherPanel">
              <Button variant="secondary">← Back to Dashboard</Button>
            </Link>
          </div>

          {/* Add Class Form */}
          <Card className="bg-slate-800/50 backdrop-blur-xl border border-white/10 shadow-2xl mb-8">
            <form onSubmit={handleAddClass} className="flex gap-4">
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Enter class name (e.g., Computer Science 2024)"
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button type="submit" disabled={isAdding || !newClassName.trim()}>
                <AddIcon className="w-5 h-5 mr-1" />
                {isAdding ? 'Adding...' : 'Add Class'}
              </Button>
            </form>
          </Card>

          {/* Classes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-slate-800/50 rounded-xl p-4 border border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">{cls.name}</h3>
                  <p className="text-gray-400 text-sm">Class ID: {cls.id}</p>
                </div>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <DeleteIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {classes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No classes found. Add one above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassList;