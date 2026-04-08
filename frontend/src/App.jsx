import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/StudentLogin" element={<StudentLogin />} />
        <Route path="/StudentPanel" element={<StudentPanel />} />
        <Route path="/StudentAdd" element={<StudentAdd />} />
        <Route path="/CourseAdd" element={<CourseAdd />} />
        <Route path="/Classes" element={<Classes />} />
        <Route path="/EditStudent" element={<EditStudent />} />
        <Route path="/TeacherLogin" element={<TeacherLogin />} />
        <Route path="/TeacherPanel" element={<TeacherPanel />} />
        <Route path="/ClassList" element={<ClassList />} />
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
