import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetTeachersQuery, useDeleteTeacherMutation } from '../../RTK/userAPI';
import Button from '../../components/common/Button';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
      {/* Navbar - Daha ince ve yüksek kontrastlı cam efekti */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
              <SchoolIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white uppercase">
              SMS <span className="text-slate-500 font-medium">Portal</span>
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
        {/* Header - Tipografi Hiyerarşisi Düzenlendi */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Faculty Members</h1>
            <p className="text-slate-500 text-sm">Manage academic staff profiles and department assignments.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/TeacherPanel')}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-all uppercase tracking-wider"
            >
              Dashboard
            </button>
            <Button 
              onClick={() => navigate('/AddTeacher')}
              className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !rounded-lg !px-4 !py-2 !text-xs !font-bold !shadow-none ring-1 ring-white/10"
            >
              <AddIcon className="w-4 h-4 mr-2" />
              ADD TEACHER
            </Button>
          </div>
        </div>

        {/* Search - Minimalist & Modern Focus States */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter by name, specialty or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-900 transition-all shadow-inner"
          />
        </div>

        {/* Table - Bento Grid Esintili & Temiz Satırlar */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Instructor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Specialty</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="group hover:bg-indigo-500/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            fontSize: '14px', 
                            fontWeight: 700,
                            bgcolor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#818cf8'
                          }}
                        >
                          {teacher.name.charAt(0)}
                        </Avatar>
                        <div>
                          <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {teacher.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">Faculty Member</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-indigo-400 bg-indigo-400/5 px-2 py-1 rounded-md border border-indigo-400/10">
                        {teacher.specialty?.toUpperCase() || 'GENERAL'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-slate-400">
                        <MailOutlineIcon className="w-3.5 h-3.5 mr-2 opacity-40" />
                        {teacher.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 tracking-tight uppercase">
                        Online
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <IconButton 
                        onClick={(e) => handleMenuOpen(e, teacher.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        size="small"
                        sx={{ color: '#64748b' }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State - Daha Profesyonel */}
        {filteredTeachers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 rounded-2xl border border-dashed border-white/5 mt-4">
            <SearchIcon className="w-12 h-12 text-slate-800 mb-4" />
            <p className="text-sm font-medium text-slate-500">No matching faculty members found.</p>
          </div>
        )}
      </div>

      {/* Action Menu - SaaS Stili */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock
        PaperProps={{
          sx: {
            bgcolor: '#0f172a',
            backgroundImage: 'none',
            color: '#94a3b8',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            mt: 1,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            '& .MuiMenuItem-root': {
              fontSize: '12px',
              fontWeight: 600,
              gap: '12px',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.03)', color: '#fff' }
            }
          }
        }}
      >
        <MenuItem onClick={() => { navigate(`/EditTeacher/${selectedTeacherId}`); handleMenuClose(); }}>
          <EditIcon sx={{ fontSize: 16 }} /> Edit Profile
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#f87171', '&:hover': { color: '#ef4444 !important' } }}>
          <DeleteOutlineIcon sx={{ fontSize: 16 }} /> Remove Member
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TeacherList;