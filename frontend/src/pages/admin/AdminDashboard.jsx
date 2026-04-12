import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { UserIcon, SchoolIcon, ClassIcon, BookIcon } from '../../components/common/Icons';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      </div>
    </div>
  );
}