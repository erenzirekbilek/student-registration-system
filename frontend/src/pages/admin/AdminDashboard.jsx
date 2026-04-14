import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { UserIcon, SchoolIcon, ClassIcon, BookIcon } from '../../components/common/Icons';
import {
  useGetNoticesQuery, useCreateNoticeMutation, useDeleteNoticeMutation,
  useGetRegulationsQuery, useCreateRegulationMutation, useDeleteRegulationMutation
} from '../../RTK/userAPI';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notices');
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showRegulationModal, setShowRegulationModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', noticeType: 'General', targetRole: 'ALL' });
  const [regulationForm, setRegulationForm] = useState({ title: '', content: '', category: 'General', articleNumber: '' });

  const { data: noticesData, refetch: refetchNotices } = useGetNoticesQuery();
  const { data: regulationsData, refetch: refetchRegulations } = useGetRegulationsQuery();
  const [createNotice] = useCreateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();
  const [createRegulation] = useCreateRegulationMutation();
  const [deleteRegulation] = useDeleteRegulationMutation();

  const notices = noticesData || [];
  const regulations = regulationsData || [];

  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (!adminData) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admins/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <CircularProgress sx={{ color: '#7c3aed' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outlined" color="error">
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <UserIcon size={24} />
                </div>
                <div>
                  <Typography color="text.secondary" variant="body2">Total Students</Typography>
                  <Typography variant="h4">{stats?.totalStudents || 0}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <SchoolIcon sx={{ color: '#7c3aed' }} />
                </div>
                <div>
                  <Typography color="text.secondary" variant="body2">Total Teachers</Typography>
                  <Typography variant="h4">{stats?.totalTeachers || 0}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <ClassIcon size={24} />
                </div>
                <div>
                  <Typography color="text.secondary" variant="body2">Total Classes</Typography>
                  <Typography variant="h4">{stats?.totalClasses || 0}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <BookIcon size={24} />
                </div>
                <div>
                  <Typography color="text.secondary" variant="body2">Total Courses</Typography>
                  <Typography variant="h4">{stats?.totalCourses || 0}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ py: 2, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
            onClick={() => navigate('/admin/students')}
          >
            Manage Students
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ py: 2, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
            onClick={() => navigate('/admin/teachers')}
          >
            Manage Teachers
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ py: 2, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
            onClick={() => navigate('/admin/courses')}
          >
            Manage Courses
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ py: 2, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
            onClick={() => navigate('/admin/classes')}
          >
            Manage Classes
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Students per Class</Typography>
              {stats?.studentsPerClass && Object.entries(stats.studentsPerClass).map(([cls, count]) => (
                <div key={cls} className="flex justify-between py-2 border-b">
                  <span>{cls}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Average Grade per Course</Typography>
              {stats?.averageGradePerCourse && Object.entries(stats.averageGradePerCourse).map(([course, avg]) => (
                <div key={course} className="flex justify-between py-2 border-b">
                  <span>{course}</span>
                  <span className="font-bold">{avg.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <div className="flex gap-4 mb-4">
            <Button 
              variant={activeTab === 'notices' ? 'contained' : 'outlined'} 
              onClick={() => setActiveTab('notices')}
              sx={{ bgcolor: activeTab === 'notices' ? '#7c3aed' : 'transparent', color: activeTab === 'notices' ? 'white' : '#7c3aed', borderColor: '#7c3aed' }}
            >
              Notices
            </Button>
            <Button 
              variant={activeTab === 'regulations' ? 'contained' : 'outlined'} 
              onClick={() => setActiveTab('regulations')}
              sx={{ bgcolor: activeTab === 'regulations' ? '#7c3aed' : 'transparent', color: activeTab === 'regulations' ? 'white' : '#7c3aed', borderColor: '#7c3aed' }}
            >
              Regulations
            </Button>
          </div>

          {activeTab === 'notices' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Manage Notices</Typography>
                  <Button variant="contained" size="small" onClick={() => setShowNoticeModal(true)} sx={{ bgcolor: '#10b981' }}>
                    + Add Notice
                  </Button>
                </div>
                {notices.length === 0 ? (
                  <Typography color="text.secondary">No notices yet</Typography>
                ) : (
                  <div className="space-y-2">
                    {notices.map((notice) => (
                      <div key={notice.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <Typography fontWeight="bold">{notice.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{notice.content?.substring(0, 50)}...</Typography>
                        </div>
                        <Button color="error" size="small" onClick={() => deleteNotice(notice.id).then(refetchNotices)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'regulations' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Manage Regulations</Typography>
                  <Button variant="contained" size="small" onClick={() => setShowRegulationModal(true)} sx={{ bgcolor: '#10b981' }}>
                    + Add Regulation
                  </Button>
                </div>
                {regulations.length === 0 ? (
                  <Typography color="text.secondary">No regulations yet</Typography>
                ) : (
                  <div className="space-y-2">
                    {regulations.map((reg) => (
                      <div key={reg.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <Typography fontWeight="bold">{reg.title} (Art. {reg.articleNumber})</Typography>
                          <Typography variant="body2" color="text.secondary">{reg.category}</Typography>
                        </div>
                        <Button color="error" size="small" onClick={() => deleteRegulation(reg.id).then(refetchRegulations)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {showNoticeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Typography variant="h6" mb={3}>Create Notice</Typography>
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Title" value={noticeForm.title} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} />
              <textarea className="w-full mb-3 px-3 py-2 border rounded" rows={3} placeholder="Content" value={noticeForm.content} onChange={e => setNoticeForm({...noticeForm, content: e.target.value})} />
              <select className="w-full mb-3 px-3 py-2 border rounded" value={noticeForm.noticeType} onChange={e => setNoticeForm({...noticeForm, noticeType: e.target.value})}>
                <option value="General">General</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
                <option value="Urgent">Urgent</option>
              </select>
              <select className="w-full mb-4 px-3 py-2 border rounded" value={noticeForm.targetRole} onChange={e => setNoticeForm({...noticeForm, targetRole: e.target.value})}>
                <option value="ALL">All</option>
                <option value="STUDENT">Students Only</option>
                <option value="TEACHER">Teachers Only</option>
              </select>
              <div className="flex gap-2">
                <Button variant="contained" onClick={() => createNotice(noticeForm).then(() => { setShowNoticeModal(false); setNoticeForm({ title: '', content: '', noticeType: 'General', targetRole: 'ALL' }); refetchNotices(); })}>Save</Button>
                <Button variant="outlined" onClick={() => setShowNoticeModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showRegulationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Typography variant="h6" mb={3}>Create Regulation</Typography>
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Title" value={regulationForm.title} onChange={e => setRegulationForm({...regulationForm, title: e.target.value})} />
              <textarea className="w-full mb-3 px-3 py-2 border rounded" rows={3} placeholder="Content" value={regulationForm.content} onChange={e => setRegulationForm({...regulationForm, content: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Category" value={regulationForm.category} onChange={e => setRegulationForm({...regulationForm, category: e.target.value})} />
              <input className="w-full mb-4 px-3 py-2 border rounded" placeholder="Article Number (e.g. 5.2)" value={regulationForm.articleNumber} onChange={e => setRegulationForm({...regulationForm, articleNumber: e.target.value})} />
              <div className="flex gap-2">
                <Button variant="contained" onClick={() => createRegulation(regulationForm).then(() => { setShowRegulationModal(false); setRegulationForm({ title: '', content: '', category: 'General', articleNumber: '' }); refetchRegulations(); })}>Save</Button>
                <Button variant="outlined" onClick={() => setShowRegulationModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}