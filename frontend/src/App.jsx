import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import StudentLogin from './pages/student/StudentLogin';
import StudentPanel from './pages/student/StudentPanel';
import StudentAdd from './pages/student/StudentAdd';
import CourseAdd from './pages/student/CourseAdd';
import Classes from './pages/student/Classes';
import EditStudent from './pages/student/EditStudent';
import TeacherLogin from './pages/teacher/TeacherLogin';
import TeacherPanel from './pages/teacher/TeacherPanel';
import TeacherList from './pages/teacher/TeacherList';
import TeacherSignin from './pages/teacher/TeacherSignin';
import StudentRegister from './pages/student/StudentRegister';
import ClassList from './pages/teacher/ClassList';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, userType }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      if (userType === 'student') {
        const studentData = localStorage.getItem('studentData');
        setIsAuthenticated(!!studentData);
      } else if (userType === 'teacher') {
        const teacherData = localStorage.getItem('teacherData');
        setIsAuthenticated(!!teacherData);
      }
    };
    checkAuth();
  }, [userType]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={userType === 'student' ? '/StudentLogin' : '/TeacherLogin'} state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  userType: PropTypes.string.isRequired,
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/StudentLogin" element={<StudentLogin />} />
        <Route path="/StudentPanel" element={
          <ProtectedRoute userType="student">
            <StudentPanel />
          </ProtectedRoute>
        } />
        <Route path="/StudentAdd" element={
          <ProtectedRoute userType="student">
            <StudentAdd />
          </ProtectedRoute>
        } />
        <Route path="/CourseAdd" element={
          <ProtectedRoute userType="student">
            <CourseAdd />
          </ProtectedRoute>
        } />
        <Route path="/Classes" element={
          <ProtectedRoute userType="student">
            <Classes />
          </ProtectedRoute>
        } />
        <Route path="/EditStudent" element={
          <ProtectedRoute userType="student">
            <EditStudent />
          </ProtectedRoute>
        } />
        <Route path="/TeacherLogin" element={<TeacherLogin />} />
        <Route path="/TeacherPanel" element={
          <ProtectedRoute userType="teacher">
            <TeacherPanel />
          </ProtectedRoute>
        } />
        <Route path="/ClassList" element={
          <ProtectedRoute userType="teacher">
            <ClassList />
          </ProtectedRoute>
        } />
        <Route path="/TeacherList" element={<TeacherList />} />
        <Route path="/TeacherSignin" element={<TeacherSignin />} />
        <Route path="/TeacherRegister" element={<TeacherSignin />} />
        <Route path="/StudentRegister" element={<StudentRegister />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
