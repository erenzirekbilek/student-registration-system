import studentsData from '../mock/students.json';
import teachersData from '../mock/teachers.json';

// Mock data service that mimics the API structure
const mockDataService = {
  // Students endpoints
  getStudents: () => Promise.resolve(studentsData),
  getStudent: (id) => {
    const student = studentsData.find(s => s.id === parseInt(id));
    return Promise.resolve(student || null);
  },
  addStudent: (student) => {
    const newStudent = {
      ...student,
      id: Date.now(), // Simple ID generation for mock
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    // In a real app, we would update the data source
    return Promise.resolve(newStudent);
  },
  updateStudent: (student) => {
    const index = studentsData.findIndex(s => s.id === student.id);
    if (index !== -1) {
      const updatedStudent = {
        ...student,
        updatedAt: new Date().toISOString()
      };
      // In a real app, we would update the data source
      return Promise.resolve(updatedStudent);
    }
    return Promise.reject(new Error('Student not found'));
  },
  deleteStudent: (id) => {
    // In a real app, we would delete from the data source
    return Promise.resolve({ success: true });
  },
  studentLogin: (credentials) => {
    // Simple mock login - in reality, you'd validate credentials
    const student = studentsData.find(
      s => s.email === credentials.email 
    );
    if (student) {
      return Promise.resolve({
        ...student,
        token: 'mock-jwt-token',
        password: undefined // Don't return password
      });
    }
    return Promise.reject(new Error('Invalid credentials'));
  },

  // Teachers endpoints
  getTeachers: () => Promise.resolve(teachersData),
  getTeacher: (id) => {
    const teacher = teachersData.find(t => t.id === parseInt(id));
    return Promise.resolve(teacher || null);
  },
  addTeacher: (teacher) => {
    const newTeacher = {
      ...teacher,
      id: Date.now(), // Simple ID generation for mock
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return Promise.resolve(newTeacher);
  },
  updateTeacher: (teacher) => {
    const index = teachersData.findIndex(t => t.id === teacher.id);
    if (index !== -1) {
      const updatedTeacher = {
        ...teacher,
        updatedAt: new Date().toISOString()
      };
      return Promise.resolve(updatedTeacher);
    }
    return Promise.reject(new Error('Teacher not found'));
  },
  deleteTeacher: (id) => {
    return Promise.resolve({ success: true });
  },
  teacherLogin: (credentials) => {
    // Simple mock login
    const teacher = teachersData.find(
      t => t.email === credentials.email 
    );
    if (teacher) {
      return Promise.resolve({
        ...teacher,
        token: 'mock-jwt-token',
        password: undefined // Don't return password
      });
    }
    return Promise.reject(new Error('Invalid credentials'));
  },

  // Additional endpoints can be added as needed
  getCourses: () => Promise.resolve([]),
  getClasses: () => Promise.resolve([]),
  getEnrollments: () => Promise.resolve([]),
  getAttendance: () => Promise.resolve([]),
  getNotices: () => Promise.resolve([]),
  getRegulations: () => Promise.resolve([]),
  getCalendarEvents: () => Promise.resolve([]),
  getExamSchedules: () => Promise.resolve([])
};

export default mockDataService;