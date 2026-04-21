import { createApi } from "@reduxjs/toolkit/query/react";

const mockStudents = [
  { id: 1, studentNumber: "STU001", name: "Ahmet Yılmaz", email: "ahmet.yilmaz@email.com", password: "123", grade: "10", classId: 1, attendance: 95 },
  { id: 2, studentNumber: "STU002", name: "Elif Şahin", email: "elif.sahin@email.com", password: "123", grade: "11", classId: 2, attendance: 92 },
  { id: 3, studentNumber: "STU003", name: "Mehmet Demir", email: "mehmet.demir@email.com", password: "123", grade: "9", classId: 3, attendance: 88 }
];

const mockTeachers = [
  { id: 1, teacherId: "TCH001", name: "Dr. Ayşe Özkan", email: "ayse.ozkan@email.com", password: "123", department: "Matematik" },
  { id: 2, teacherId: "TCH002", name: "Prof. Mehmet Yılmaz", email: "mehmet.yilmaz@email.com", password: "123", department: "Fizik" },
  { id: 3, teacherId: "TCH003", name: "Dr. Fatma Demir", email: "fatma.demir@email.com", password: "123", department: "Kimya" }
];

const mockCourses = [
  { id: 1, name: "Matematik", code: "MATH101", teacherId: 1, classId: 1 },
  { id: 2, name: "Fizik", code: "PHY101", teacherId: 2, classId: 1 },
  { id: 3, name: "Kimya", code: "CHEM101", teacherId: 3, classId: 2 }
];

const mockClasses = [
  { id: 1, name: "10-A", grade: "10" },
  { id: 2, name: "11-A", grade: "11" },
  { id: 3, name: "9-A", grade: "9" }
];

const mockAttendance = [
  { id: 1, studentId: 1, courseId: 1, date: "2024-01-15", status: "present" },
  { id: 2, studentId: 1, courseId: 2, date: "2024-01-15", status: "present" },
  { id: 3, studentId: 2, courseId: 1, date: "2024-01-15", status: "absent" }
];

const mockEnrollments = [
  { id: 1, studentId: 1, courseId: 1, grade: 85, attendance: 95 },
  { id: 2, studentId: 1, courseId: 2, grade: 78, attendance: 90 }
];

const mockNotices = [
  { id: 1, title: "Sınav Tarihleri", content: "Sınavlar 20 Ocak'ta başlayacak", role: "student", createdAt: "2024-01-10" },
  { id: 2, title: "Toplantı", content: "Öğretmenler toplantısı pazartesi", role: "teacher", createdAt: "2024-01-10" }
];

const mockRegulations = [
  { id: 1, title: "Devam Kuralları", content: "%80 devam zorunludur", category: "attendance" },
  { id: 2, title: "Sınav Kuralları", content: "Telefon yasak", category: "exam" }
];

const mockCalendar = [
  { id: 1, title: "Yarıyıl Tatili", date: "2024-01-20", type: "holiday" },
  { id: 2, title: "Toplantı", date: "2024-01-15", type: "event" }
];

const mockExams = [
  { id: 1, courseId: 1, title: "Matematik Sınavı", date: "2024-01-20", location: "Derslik 101" },
  { id: 2, courseId: 2, title: "Fizik Sınavı", date: "2024-01-21", location: "Derslik 102" }
];

let students = [...mockStudents];
let teachers = [...mockTeachers];
let courses = [...mockCourses];
let classes = [...mockClasses];
let attendance = [...mockAttendance];
let enrollments = [...mockEnrollments];
let notices = [...mockNotices];

const mockBaseQuery = (arg) => {
  const { url, body } = arg || {};
  
  if (url === '/students') return { data: students };
  if (url === '/students/login') {
    const student = students.find(s => s.email === body?.email && s.password === body?.password);
    if (!student) return { error: { status: 401, data: "Invalid credentials" } };
    
    // ÇÖZÜM: Object.assign ile kopyalayıp password'ü sil
    const userData = Object.assign({}, student);
    delete userData.password;
    return { data: userData };
  }
  if (url === '/teachers') return { data: teachers };
  if (url === '/teachers/login') {
    const teacher = teachers.find(t => t.email === body?.email && t.password === body?.password);
    if (!teacher) return { error: { status: 401, data: "Invalid credentials" } };
    
    // ÇÖZÜM: Object.assign ile kopyalayıp password'ü sil
    const userData = Object.assign({}, teacher);
    delete userData.password;
    return { data: userData };
  }
  if (url === '/courses') return { data: courses };
  if (url?.startsWith('/courses/class/')) {
    const classId = parseInt(url.split('/').pop());
    return { data: courses.filter(c => c.classId === classId) };
  }
  if (url?.startsWith('/courses/teacher/')) {
    const teacherId = parseInt(url.split('/').pop());
    return { data: courses.filter(c => c.teacherId === teacherId) };
  }
  if (url === '/classes') return { data: classes };
  if (url === '/attendance') return { data: attendance };
  if (url?.startsWith('/attendance/student/')) {
    const studentId = parseInt(url.split('/').pop());
    return { data: attendance.filter(a => a.studentId === studentId) };
  }
  if (url?.startsWith('/attendance/course/')) {
    const courseId = parseInt(url.split('/').pop());
    return { data: attendance.filter(a => a.courseId === courseId) };
  }
  if (url === '/enrollments') return { data: enrollments };
  if (url?.startsWith('/enrollments/student/')) {
    const studentId = parseInt(url.split('/').pop());
    return { data: enrollments.filter(e => e.studentId === studentId) };
  }
  if (url === '/notices') return { data: notices };
  if (url === '/notices/role/student') return { data: notices.filter(n => n.role === 'student') };
  if (url === '/notices/role/teacher') return { data: notices.filter(n => n.role === 'teacher') };
  if (url === '/regulations') return { data: mockRegulations };
  if (url === '/calendar') return { data: mockCalendar };
  if (url === '/exams') return { data: mockExams };
  
  return { data: [] };
};

const mockUserApi = createApi({
  reducerPath: "userApi",
  baseQuery: mockBaseQuery,
  tagTypes: ["Student", "Teacher", "Course", "Class", "Attendance", "Enrollment", "Notice", "Regulation", "Calendar", "Exam"],
  endpoints: (builder) => ({
    getStudents: builder.query({ query: () => ({ url: '/students' }), providesTags: ["Student"] }),
    getStudent: builder.query({ query: (id) => ({ url: `/students/${id}` }), providesTags: ["Student"] }),
    addStudent: builder.mutation({ query: (student) => ({ url: '/students', method: 'POST', body: student }), invalidatesTags: ["Student"] }),
    updateStudent: builder.mutation({ query: (student) => ({ url: `/students/${student.id}`, method: 'PUT', body: student }), invalidatesTags: ["Student"] }),
    deleteStudent: builder.mutation({ query: (id) => ({ url: `/students/${id}`, method: 'DELETE' }), invalidatesTags: ["Student"] }),
    studentLogin: builder.mutation({ query: (credentials) => ({ url: '/students/login', method: 'POST', body: credentials }) }),
    
    getTeachers: builder.query({ query: () => ({ url: '/teachers' }), providesTags: ["Teacher"] }),
    getTeacher: builder.query({ query: (id) => ({ url: `/teachers/${id}` }), providesTags: ["Teacher"] }),
    addTeacher: builder.mutation({ query: (teacher) => ({ url: '/teachers', method: 'POST', body: teacher }), invalidatesTags: ["Teacher"] }),
    updateTeacher: builder.mutation({ query: (teacher) => ({ url: `/teachers/${teacher.id}`, method: 'PUT', body: teacher }), invalidatesTags: ["Teacher"] }),
    deleteTeacher: builder.mutation({ query: (id) => ({ url: `/teachers/${id}`, method: 'DELETE' }), invalidatesTags: ["Teacher"] }),
    teacherLogin: builder.mutation({ query: (credentials) => ({ url: '/teachers/login', method: 'POST', body: credentials }) }),
    
    getCourses: builder.query({ query: () => ({ url: '/courses' }), providesTags: ["Course"] }),
    getCourse: builder.query({ query: (id) => ({ url: `/courses/${id}` }), providesTags: ["Course"] }),
    addCourse: builder.mutation({ query: (course) => ({ url: '/courses', method: 'POST', body: course }), invalidatesTags: ["Course"] }),
    updateCourse: builder.mutation({ query: (course) => ({ url: `/courses/${course.id}`, method: 'PUT', body: course }), invalidatesTags: ["Course"] }),
    deleteCourse: builder.mutation({ query: (id) => ({ url: `/courses/${id}`, method: 'DELETE' }), invalidatesTags: ["Course"] }),
    getCoursesByClass: builder.query({ query: (classId) => ({ url: `/courses/class/${classId}` }), providesTags: ["Course"] }),
    getCoursesByTeacher: builder.query({ query: (teacherId) => ({ url: `/courses/teacher/${teacherId}` }), providesTags: ["Course"] }),
    
    getClasses: builder.query({ query: () => ({ url: '/classes' }), providesTags: ["Class"] }),
    getClass: builder.query({ query: (id) => ({ url: `/classes/${id}` }), providesTags: ["Class"] }),
    addClass: builder.mutation({ query: (schoolClass) => ({ url: '/classes', method: 'POST', body: schoolClass }), invalidatesTags: ["Class"] }),
    updateClass: builder.mutation({ query: (schoolClass) => ({ url: `/classes/${schoolClass.id}`, method: 'PUT', body: schoolClass }), invalidatesTags: ["Class"] }),
    deleteClass: builder.mutation({ query: (id) => ({ url: `/classes/${id}`, method: 'DELETE' }), invalidatesTags: ["Class"] }),
    
    getAttendance: builder.query({ query: () => ({ url: '/attendance' }), providesTags: ["Attendance"] }),
    getAttendanceByStudent: builder.query({ query: (studentId) => ({ url: `/attendance/student/${studentId}` }), providesTags: ["Attendance"] }),
    getAttendanceByCourse: builder.query({ query: (courseId) => ({ url: `/attendance/course/${courseId}` }), providesTags: ["Attendance"] }),
    markAttendance: builder.mutation({ query: (data) => ({ url: '/attendance', method: 'POST', body: data }), invalidatesTags: ["Attendance"] }),
    
    getEnrollments: builder.query({ query: () => ({ url: '/enrollments' }), providesTags: ["Enrollment"] }),
    getEnrollmentsByStudent: builder.query({ query: (studentId) => ({ url: `/enrollments/student/${studentId}` }), providesTags: ["Enrollment"] }),
    enrollStudent: builder.mutation({ query: (enrollment) => ({ url: '/enrollments', method: 'POST', body: enrollment }), invalidatesTags: ["Enrollment"] }),
    
    getNotices: builder.query({ query: () => ({ url: '/notices' }), providesTags: ["Notice"] }),
    getNoticesByRole: builder.query({ query: (role) => ({ url: `/notices/role/${role}` }), providesTags: ["Notice"] }),
    createNotice: builder.mutation({ query: (notice) => ({ url: '/notices', method: 'POST', body: notice }), invalidatesTags: ["Notice"] }),
    deleteNotice: builder.mutation({ query: (id) => ({ url: `/notices/${id}`, method: 'DELETE' }), invalidatesTags: ["Notice"] }),
    
    getRegulations: builder.query({ query: () => ({ url: '/regulations' }), providesTags: ["Regulation"] }),
    createRegulation: builder.mutation({ query: (reg) => ({ url: '/regulations', method: 'POST', body: reg }), invalidatesTags: ["Regulation"] }),
    deleteRegulation: builder.mutation({ query: (id) => ({ url: `/regulations/${id}`, method: 'DELETE' }), invalidatesTags: ["Regulation"] }),
    
    getCalendarEvents: builder.query({ query: () => ({ url: '/calendar' }), providesTags: ["Calendar"] }),
    createCalendarEvent: builder.mutation({ query: (event) => ({ url: '/calendar', method: 'POST', body: event }), invalidatesTags: ["Calendar"] }),
    deleteCalendarEvent: builder.mutation({ query: (id) => ({ url: `/calendar/${id}`, method: 'DELETE' }), invalidatesTags: ["Calendar"] }),
    
    getExamSchedules: builder.query({ query: () => ({ url: '/exams' }), providesTags: ["Exam"] }),
    createExamSchedule: builder.mutation({ query: (exam) => ({ url: '/exams', method: 'POST', body: exam }), invalidatesTags: ["Exam"] }),
    deleteExamSchedule: builder.mutation({ query: (id) => ({ url: `/exams/${id}`, method: 'DELETE' }), invalidatesTags: ["Exam"] }),
  })
});

export default mockUserApi;

export const {
  useGetStudentsQuery, useGetStudentQuery, useAddStudentMutation, useUpdateStudentMutation, useDeleteStudentMutation, useStudentLoginMutation,
  useGetTeachersQuery, useGetTeacherQuery, useAddTeacherMutation, useUpdateTeacherMutation, useDeleteTeacherMutation, useTeacherLoginMutation,
  useGetCoursesQuery, useGetCourseQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation, useGetCoursesByClassQuery, useGetCoursesByTeacherQuery,
  useGetClassesQuery, useGetClassQuery, useAddClassMutation, useUpdateClassMutation, useDeleteClassMutation,
  useGetAttendanceQuery, useGetAttendanceByStudentQuery, useGetAttendanceByCourseQuery, useMarkAttendanceMutation,
  useGetEnrollmentsQuery, useGetEnrollmentsByStudentQuery, useEnrollStudentMutation,
  useGetNoticesQuery, useGetNoticesByRoleQuery, useCreateNoticeMutation, useDeleteNoticeMutation,
  useGetRegulationsQuery, useCreateRegulationMutation, useDeleteRegulationMutation,
  useGetCalendarEventsQuery, useCreateCalendarEventMutation, useDeleteCalendarEventMutation,
  useGetExamSchedulesQuery, useCreateExamScheduleMutation, useDeleteExamScheduleMutation
} = mockUserApi;