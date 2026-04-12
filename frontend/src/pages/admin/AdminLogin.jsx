import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Alert } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminData', JSON.stringify(data));
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <nav className="fixed top-0 inset-x-0 z-50 h-14 border-b border-surface-100 bg-white backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <SchoolIcon style={{ fontSize: 18 }} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-surface-800">Student Management System</span>
          </Link>
        </div>
      </nav>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-100 rounded-full blur-[100px]" />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pt-14">
        <div className="w-full max-w-[380px] py-16">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 mb-5 shadow-lg shadow-primary-100">
              <SchoolIcon style={{ fontSize: 22 }} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-800">Admin Login</h1>
            <p className="mt-1.5 text-sm text-surface-500">Enter admin credentials</p>
          </div>
          <div className="bg-white border border-surface-100 rounded-2xl p-8 shadow-sm">
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}