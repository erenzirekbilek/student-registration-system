import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Student", "Teacher", "Course", "Class"],
    endpoints: (builder) => ({
        getStudents: builder.query({
            query: () => "/students",
            providesTags: ["Student"]
        }),
        getStudent: builder.query({
            query: (id) => `/students/${id}`,
            providesTags: ["Student"]
        }),
        addStudent: builder.mutation({
            query: (student) => ({
                url: "/students",
                method: "POST",
                body: student
            }),
            invalidatesTags: ["Student"]
        }),
        updateStudent: builder.mutation({
            query: (student) => ({
                url: `/students/${student.id}`,
                method: "PUT",
                body: student
            }),
            invalidatesTags: ["Student"]
        }),
        deleteStudent: builder.mutation({
            query: (id) => ({
                url: `/students/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Student"]
        }),
        studentLogin: builder.mutation({
            query: (credentials) => ({
                url: "/students/login",
                method: "POST",
                body: credentials
            })
        }),
        getTeachers: builder.query({
            query: () => "/teachers",
            providesTags: ["Teacher"]
        }),
        getTeacher: builder.query({
            query: (id) => `/teachers/${id}`,
            providesTags: ["Teacher"]
        }),
        addTeacher: builder.mutation({
            query: (teacher) => ({
                url: "/teachers",
                method: "POST",
                body: teacher
            }),
            invalidatesTags: ["Teacher"]
        }),
        updateTeacher: builder.mutation({
            query: (teacher) => ({
                url: `/teachers/${teacher.id}`,
                method: "PUT",
                body: teacher
            }),
            invalidatesTags: ["Teacher"]
        }),
        deleteTeacher: builder.mutation({
            query: (id) => ({
                url: `/teachers/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Teacher"]
        }),
        teacherLogin: builder.mutation({
            query: (credentials) => ({
                url: "/teachers/login",
                method: "POST",
                body: credentials
            })
        }),
        getCourses: builder.query({
            query: () => "/courses",
            providesTags: ["Course"]
        }),
        getCourse: builder.query({
            query: (id) => `/courses/${id}`,
            providesTags: ["Course"]
        }),
        addCourse: builder.mutation({
            query: (course) => ({
                url: "/courses",
                method: "POST",
                body: course
            }),
            invalidatesTags: ["Course"]
        }),
        updateCourse: builder.mutation({
            query: (course) => ({
                url: `/courses/${course.id}`,
                method: "PUT",
                body: course
            }),
            invalidatesTags: ["Course"]
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Course"]
        }),
        getCoursesByClass: builder.query({
            query: (classId) => `/courses/class/${classId}`,
            providesTags: ["Course"]
        }),
        getCoursesByTeacher: builder.query({
            query: (teacherId) => `/courses/teacher/${teacherId}`,
            providesTags: ["Course"]
        }),
        getClasses: builder.query({
            query: () => "/classes",
            providesTags: ["Class"]
        }),
        getClass: builder.query({
            query: (id) => `/classes/${id}`,
            providesTags: ["Class"]
        }),
        addClass: builder.mutation({
            query: (schoolClass) => ({
                url: "/classes",
                method: "POST",
                body: schoolClass
            }),
            invalidatesTags: ["Class"]
        }),
        updateClass: builder.mutation({
            query: (schoolClass) => ({
                url: `/classes/${schoolClass.id}`,
                method: "PUT",
                body: schoolClass
            }),
            invalidatesTags: ["Class"]
        }),
        deleteClass: builder.mutation({
            query: (id) => ({
                url: `/classes/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Class"]
        }),
        getEnrollments: builder.query({
            query: () => "/enrollments",
            providesTags: ["Enrollment"]
        }),
        getEnrollmentsByStudent: builder.query({
            query: (studentId) => `/enrollments/student/${studentId}`,
            providesTags: ["Enrollment"]
        }),
        getEnrollmentsByCourse: builder.query({
            query: (courseId) => `/enrollments/course/${courseId}`,
            providesTags: ["Enrollment"]
        }),
        enrollStudent: builder.mutation({
            query: (enrollment) => ({
                url: "/enrollments",
                method: "POST",
                body: enrollment
            }),
            invalidatesTags: ["Enrollment"]
        }),
        updateEnrollmentGrade: builder.mutation({
            query: ({ id, grade }) => ({
                url: `/enrollments/${id}/grade?grade=${grade}`,
                method: "PUT"
            }),
            invalidatesTags: ["Enrollment"]
        }),
        updateEnrollmentAttendance: builder.mutation({
            query: ({ id, attendance }) => ({
                url: `/enrollments/${id}/attendance?attendance=${attendance}`,
                method: "PUT"
            }),
            invalidatesTags: ["Enrollment"]
        }),
        unenrollStudent: builder.mutation({
            query: (id) => ({
                url: `/enrollments/${id}/unenroll`,
                method: "PUT"
            }),
            invalidatesTags: ["Enrollment"]
        }),
        deleteEnrollment: builder.mutation({
            query: (id) => ({
                url: `/enrollments/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Enrollment"]
        })
    })
});

export default userApi;

export const {
    useGetStudentsQuery, useGetStudentQuery, useAddStudentMutation,
    useUpdateStudentMutation, useDeleteStudentMutation, useStudentLoginMutation,
    useGetTeachersQuery, useGetTeacherQuery, useAddTeacherMutation,
    useUpdateTeacherMutation, useDeleteTeacherMutation, useTeacherLoginMutation,
    useGetCoursesQuery, useGetCourseMutation, useAddCourseMutation,
    useUpdateCourseMutation, useDeleteCourseMutation, useGetCoursesByClassQuery,
    useGetCoursesByTeacherQuery, useGetClassesQuery, useGetClassQuery,
    useAddClassMutation, useUpdateClassMutation, useDeleteClassMutation,
    useGetEnrollmentsQuery, useGetEnrollmentsByStudentQuery, useGetEnrollmentsByCourseQuery,
    useEnrollStudentMutation, useUpdateEnrollmentGradeMutation, useUpdateEnrollmentAttendanceMutation,
    useUnenrollStudentMutation, useDeleteEnrollmentMutation
} = userApi;