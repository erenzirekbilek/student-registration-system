import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetTeachersQuery, useDeleteTeacherMutation } from '../../RTK/userAPI';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';

const TeacherList = () => {
  const navigate = useNavigate();
  const { data: teachers = [], isLoading } = useGetTeachersQuery();
  const [deleteTeacher] = useDeleteTeacherMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.specialty && t.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      await deleteTeacher(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Teachers</h1>
              <p className="text-gray-400 mt-1">Manage teacher records and information</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => navigate('/TeacherPanel')}>
                ← Back to Dashboard
              </Button>
              <Button onClick={() => navigate('/AddTeacher')}>
                <AddIcon className="w-5 h-5 mr-1" />
                Add Teacher
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, department or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Table */}
          <Card className="bg-slate-800/50 backdrop-blur-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Teacher</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Courses</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Students</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-medium">{teacher.name.charAt(0)}</span>
                          </div>
                          <span className="text-white font-medium">{teacher.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{teacher.specialty || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{teacher.email}</td>
                      <td className="px-6 py-4 text-gray-300">-</td>
                      <td className="px-6 py-4 text-gray-300">-</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm">Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(teacher.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Empty state */}
          {filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-gray-500 text-lg">No teachers found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherList;