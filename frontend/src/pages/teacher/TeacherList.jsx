import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetTeachersQuery, useDeleteTeacherMutation } from '../../RTK/userAPI';
import Button from '../../components/common/Button';
import Skeleton, { SkeletonTable } from '../../components/common/Skeleton';
import { AddIcon, SearchIcon, SchoolIcon, MoreIcon, MailIcon, EditIcon, DeleteIcon } from '../../components/common/Icons';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';

const TeacherList = () => {
  const navigate = useNavigate();
  const { data: teachers = [], isLoading } = useGetTeachersQuery();
  const [deleteTeacher] = useDeleteTeacherMutation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeacherId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeacherId(null);
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.specialty && t.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      await deleteTeacher(selectedTeacherId);
      handleMenuClose();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 text-surface-600 font-sans">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-100 bg-white/80 backdrop-blur-xl h-14">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-surface-200 rounded-lg" />
              <div className="w-24 h-4 bg-surface-200 rounded" />
            </div>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-6 pt-28">
          <div className="space-y-4 mb-8">
            <Skeleton variant="title" />
            <Skeleton variant="text" width="40%" />
          </div>
          <SkeletonTable rows={8} columns={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 text-surface-600 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-100 bg-white/80 backdrop-blur-xl h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <SchoolIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-surface-800">
              SMS <span className="text-surface-400 font-medium">Portal</span>
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-surface-800 tracking-tight font-display">Faculty Members</h1>
            <p className="text-surface-500 text-sm">Manage academic staff profiles and department assignments.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/TeacherPanel')}
              className="px-4 py-2 text-xs font-semibold text-surface-500 hover:text-surface-700 transition-all uppercase tracking-wider"
            >
              Dashboard
            </button>
            <Button 
              onClick={() => navigate('/AddTeacher')}
            >
              <AddIcon className="w-4 h-4 mr-2" />
              ADD TEACHER
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Filter by name, specialty or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-surface-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-100 bg-surface-50">
                  <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Instructor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Specialty</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="group hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            fontSize: '14px', 
                            fontWeight: 700,
                            bgcolor: 'primary.50',
                            border: '1px solid',
                            borderColor: 'primary.100',
                            color: 'primary.600'
                          }}
                        >
                          {teacher.name.charAt(0)}
                        </Avatar>
                        <div>
                          <div className="text-sm font-semibold text-surface-700 group-hover:text-surface-900 transition-colors">
                            {teacher.name}
                          </div>
                          <div className="text-[11px] text-surface-400 font-medium">Faculty Member</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md border border-primary-100">
                        {teacher.specialty?.toUpperCase() || 'GENERAL'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-surface-500">
                        <MailOutlineIcon className="w-3.5 h-3.5 mr-2 opacity-40" />
                        {teacher.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 tracking-tight uppercase">
                        Online
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <IconButton 
                        onClick={(e) => handleMenuOpen(e, teacher.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        size="small"
                        sx={{ color: 'surface.400' }}
                      >
                        <MoreIcon size={20} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-surface-50 rounded-2xl border border-dashed border-surface-200 mt-4">
            <SearchIcon className="w-12 h-12 text-surface-300 mb-4" />
            <p className="text-sm font-medium text-surface-400">No matching faculty members found.</p>
          </div>
        )}
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock
        PaperProps={{
          sx: {
            bgcolor: 'white',
            backgroundImage: 'none',
            color: 'surface.600',
            border: '1px solid',
            borderColor: 'surface.200',
            borderRadius: '10px',
            mt: 1,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '& .MuiMenuItem-root': {
              fontSize: '12px',
              fontWeight: 600,
              gap: '12px',
              py: 1.5,
              '&:hover': { bgcolor: 'surface.50', color: 'surface.900' }
            }
          }
        }}
      >
        <MenuItem onClick={() => { navigate(`/EditTeacher/${selectedTeacherId}`); handleMenuClose(); }}>
          <EditIcon sx={{ fontSize: 16 }} /> Edit Profile
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'red.500', '&:hover': { color: 'red.600 !important', bgcolor: 'red.50' } }}>
          <DeleteIcon size={16} /> Remove Member
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TeacherList;