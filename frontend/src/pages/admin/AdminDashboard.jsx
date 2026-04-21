import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { UserIcon, SchoolIcon, ClassIcon, BookIcon } from '../../components/common/Icons';
import {
  useGetNoticesQuery, useCreateNoticeMutation, useDeleteNoticeMutation,
  useGetRegulationsQuery, useCreateRegulationMutation, useDeleteRegulationMutation,
  useGetCalendarEventsQuery, useCreateCalendarEventMutation, useDeleteCalendarEventMutation,
  useGetExamSchedulesQuery, useCreateExamScheduleMutation, useDeleteExamScheduleMutation,
  useGetStudentsQuery, useAddStudentMutation, useDeleteStudentMutation,
  useGetTeachersQuery, useAddTeacherMutation, useDeleteTeacherMutation,
  useGetCoursesQuery, useAddCourseMutation, useDeleteCourseMutation,
  useGetClassesQuery, useAddClassMutation, useDeleteClassMutation
} from '../../RTK/userAPI';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notices');
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showRegulationModal, setShowRegulationModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', noticeType: 'General', targetRole: 'ALL' });
  const [regulationForm, setRegulationForm] = useState({ title: '', content: '', category: 'General', articleNumber: '' });
  const [calendarForm, setCalendarForm] = useState({ title: '', description: '', eventType: 'Event', startDate: '', endDate: '' });
  const [examForm, setExamForm] = useState({ courseId: '', courseName: '', examDate: '', startTime: '', endTime: '', room: '', examType: 'Midterm' });
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '', classId: '' });
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', password: '', specialty: '' });
  const [courseForm, setCourseForm] = useState({ name: '', description: '', teacherId: '', classId: '', credit: 3, schedule: '', room: '' });
  const [classForm, setClassForm] = useState({ name: '', department: '', section: '', year: 2024 });

  const { data: noticesData, refetch: refetchNotices } = useGetNoticesQuery();
  const { data: regulationsData, refetch: refetchRegulations } = useGetRegulationsQuery();
  const { data: calendarData, refetch: refetchCalendar } = useGetCalendarEventsQuery();
  const { data: examsData, refetch: refetchExams } = useGetExamSchedulesQuery();
  const { data: studentsData, refetch: refetchStudents } = useGetStudentsQuery();
  const { data: teachersData, refetch: refetchTeachers } = useGetTeachersQuery();
  const { data: coursesData, refetch: refetchCourses } = useGetCoursesQuery();
  const { data: classesData, refetch: refetchClasses } = useGetClassesQuery();
  const [createNotice] = useCreateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();
  const [createRegulation] = useCreateRegulationMutation();
  const [deleteRegulation] = useDeleteRegulationMutation();
  const [createCalendarEvent] = useCreateCalendarEventMutation();
  const [deleteCalendarEvent] = useDeleteCalendarEventMutation();
  const [createExamSchedule] = useCreateExamScheduleMutation();
  const [deleteExamSchedule] = useDeleteExamScheduleMutation();
  const [addStudent] = useAddStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();
  const [addTeacher] = useAddTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();
  const [addCourse] = useAddCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [addClass] = useAddClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const notices = noticesData || [];
  const regulations = regulationsData || [];
  const calendarEvents = calendarData || [];
  const examSchedules = examsData || [];
  const students = studentsData || [];
  const teachers = teachersData || [];
  const courses = coursesData || [];
  const classes = classesData || [];

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
            <Button 
              variant={activeTab === 'calendar' ? 'contained' : 'outlined'} 
              onClick={() => setActiveTab('calendar')}
              sx={{ bgcolor: activeTab === 'calendar' ? '#7c3aed' : 'transparent', color: activeTab === 'calendar' ? 'white' : '#7c3aed', borderColor: '#7c3aed' }}
            >
              Academic Calendar
            </Button>
            <Button 
              variant={activeTab === 'exams' ? 'contained' : 'outlined'} 
              onClick={() => setActiveTab('exams')}
              sx={{ bgcolor: activeTab === 'exams' ? '#7c3aed' : 'transparent', color: activeTab === 'exams' ? 'white' : '#7c3aed', borderColor: '#7c3aed' }}
            >
              Exam Schedule
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

          {activeTab === 'calendar' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Academic Calendar</Typography>
                  <Button variant="contained" size="small" onClick={() => setShowCalendarModal(true)} sx={{ bgcolor: '#10b981' }}>
                    + Add Event
                  </Button>
                </div>
                {calendarEvents.length === 0 ? (
                  <Typography color="text.secondary">No events yet</Typography>
                ) : (
                  <div className="space-y-2">
                    {calendarEvents.map((event) => (
                      <div key={event.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <Typography fontWeight="bold">{event.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{event.startDate} {event.endDate ? `- ${event.endDate}` : ''} | {event.eventType}</Typography>
                        </div>
                        <Button color="error" size="small" onClick={() => deleteCalendarEvent(event.id).then(refetchCalendar)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'exams' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Exam Schedule</Typography>
                  <Button variant="contained" size="small" onClick={() => setShowExamModal(true)} sx={{ bgcolor: '#10b981' }}>
                    + Add Exam
                  </Button>
                </div>
                {examSchedules.length === 0 ? (
                  <Typography color="text.secondary">No exams scheduled</Typography>
                ) : (
                  <div className="space-y-2">
                    {examSchedules.map((exam) => (
                      <div key={exam.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <Typography fontWeight="bold">{exam.courseName}</Typography>
                          <Typography variant="body2" color="text.secondary">{exam.examDate} | {exam.startTime}-{exam.endTime} | {exam.room} | {exam.examType}</Typography>
                        </div>
                        <Button color="error" size="small" onClick={() => deleteExamSchedule(exam.id).then(refetchExams)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'manage-students' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Manage Students</Typography>
                  <Button variant="contained" size="small" onClick={() => setShowStudentModal(true)} sx={{ bgcolor: '#10b981' }}>
                    + Add Student
                  </Button>
                </div>
                {students.length === 0 ? (
                  <Typography color="text.secondary">No students</Typography>
                ) : (
                  <div className="space-y-2">
                    {students.map((s) => (
                      <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <Typography fontWeight="bold">{s.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{s.email} | Class ID: {s.classId}</Typography>
                        </div>
                        <Button color="error" size="small" onClick={() => deleteStudent(s.id).then(refetchStudents)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'manage-teachers' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Manage Teachers</Typography>
                  <Button variant="contained" size="small" onClick={() => setShowTeacherModal(true)} sx={{ bgcolor: '#10b981' }}>
                    + Add Teacher
                  </Button>
                </div>
                {teachers.length === 0 ? (
                  <Typography color="text.secondary">No teachers</Typography>
                ) : (
                  <div className="space-y-2">
                    {teachers.map((t) => (
                      <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <Typography fontWeight="bold">{t.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{t.email} | {t.specialty}</Typography>
                        </div>
                        <Button color="error" size="small" onClick={() => deleteTeacher(t.id).then(refetchTeachers)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'manage-courses' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Manage Courses</Typography>
                  <Button variant="contained" size="small" onClick={() => setShowCourseModal(true)} sx={{ bgcolor: '#10b981' }}>
                    + Add Course
                  </Button>
                </div>
                {courses.length === 0 ? (
                  <Typography color="text.secondary">No courses</Typography>
                ) : (
                  <div className="space-y-2">
                    {courses.map((c) => (
                      <div key={c.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <Typography fontWeight="bold">{c.name}</Typography>
                          <Typography variant="body2" color="text.secondary">Class: {c.classId} | Teacher: {c.teacherId} | {c.schedule}</Typography>
                        </div>
                        <Button color="error" size="small" onClick={() => deleteCourse(c.id).then(refetchCourses)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'manage-classes' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Manage Classes</Typography>
                  <Button variant="contained" size="small" onClick={() => setShowClassModal(true)} sx={{ bgcolor: '#10b981' }}>
                    + Add Class
                  </Button>
                </div>
                {classes.length === 0 ? (
                  <Typography color="text.secondary">No classes</Typography>
                ) : (
                  <div className="space-y-2">
                    {classes.map((cl) => (
                      <div key={cl.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <Typography fontWeight="bold">{cl.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{cl.department} | Section {cl.section} | Year {cl.year}</Typography>
                        </div>
                        <Button color="error" size="small" onClick={() => deleteClass(cl.id).then(refetchClasses)}>
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

        {showCalendarModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Typography variant="h6" mb={3}>Add Calendar Event</Typography>
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Event Title" value={calendarForm.title} onChange={e => setCalendarForm({...calendarForm, title: e.target.value})} />
              <textarea className="w-full mb-3 px-3 py-2 border rounded" rows={2} placeholder="Description" value={calendarForm.description} onChange={e => setCalendarForm({...calendarForm, description: e.target.value})} />
              <select className="w-full mb-3 px-3 py-2 border rounded" value={calendarForm.eventType} onChange={e => setCalendarForm({...calendarForm, eventType: e.target.value})}>
                <option value="Registration">Registration</option>
                <option value="Semester">Semester</option>
                <option value="Holiday">Holiday</option>
                <option value="Event">Event</option>
                <option value="Deadline">Deadline</option>
              </select>
              <input type="date" className="w-full mb-3 px-3 py-2 border rounded" value={calendarForm.startDate} onChange={e => setCalendarForm({...calendarForm, startDate: e.target.value})} />
              <input type="date" className="w-full mb-4 px-3 py-2 border rounded" value={calendarForm.endDate} onChange={e => setCalendarForm({...calendarForm, endDate: e.target.value})} />
              <div className="flex gap-2">
                <Button variant="contained" onClick={() => createCalendarEvent(calendarForm).then(() => { setShowCalendarModal(false); setCalendarForm({ title: '', description: '', eventType: 'Event', startDate: '', endDate: '' }); refetchCalendar(); })}>Save</Button>
                <Button variant="outlined" onClick={() => setShowCalendarModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showExamModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Typography variant="h6" mb={3}>Add Exam Schedule</Typography>
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Course Name" value={examForm.courseName} onChange={e => setExamForm({...examForm, courseName: e.target.value})} />
              <input type="date" className="w-full mb-3 px-3 py-2 border rounded" value={examForm.examDate} onChange={e => setExamForm({...examForm, examDate: e.target.value})} />
              <div className="flex gap-2 mb-3">
                <input type="time" className="flex-1 px-3 py-2 border rounded" placeholder="Start Time" value={examForm.startTime} onChange={e => setExamForm({...examForm, startTime: e.target.value})} />
                <input type="time" className="flex-1 px-3 py-2 border rounded" placeholder="End Time" value={examForm.endTime} onChange={e => setExamForm({...examForm, endTime: e.target.value})} />
              </div>
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Room" value={examForm.room} onChange={e => setExamForm({...examForm, room: e.target.value})} />
              <select className="w-full mb-4 px-3 py-2 border rounded" value={examForm.examType} onChange={e => setExamForm({...examForm, examType: e.target.value})}>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="Quiz">Quiz</option>
                <option value="Practical">Practical</option>
              </select>
              <div className="flex gap-2">
                <Button variant="contained" onClick={() => createExamSchedule(examForm).then(() => { setShowExamModal(false); setExamForm({ courseId: '', courseName: '', examDate: '', startTime: '', endTime: '', room: '', examType: 'Midterm' }); refetchExams(); })}>Save</Button>
                <Button variant="outlined" onClick={() => setShowExamModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showStudentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Typography variant="h6" mb={3}>Add Student</Typography>
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Name" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Email" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Password" type="password" value={studentForm.password} onChange={e => setStudentForm({...studentForm, password: e.target.value})} />
              <input className="w-full mb-4 px-3 py-2 border rounded" placeholder="Class ID" type="number" value={studentForm.classId} onChange={e => setStudentForm({...studentForm, classId: e.target.value})} />
              <div className="flex gap-2">
                <Button variant="contained" onClick={() => addStudent(studentForm).then(() => { setShowStudentModal(false); setStudentForm({ name: '', email: '', password: '', classId: '' }); refetchStudents(); })}>Save</Button>
                <Button variant="outlined" onClick={() => setShowStudentModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showTeacherModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Typography variant="h6" mb={3}>Add Teacher</Typography>
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Name" value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Email" value={teacherForm.email} onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Password" type="password" value={teacherForm.password} onChange={e => setTeacherForm({...teacherForm, password: e.target.value})} />
              <input className="w-full mb-4 px-3 py-2 border rounded" placeholder="Specialty" value={teacherForm.specialty} onChange={e => setTeacherForm({...teacherForm, specialty: e.target.value})} />
              <div className="flex gap-2">
                <Button variant="contained" onClick={() => addTeacher(teacherForm).then(() => { setShowTeacherModal(false); setTeacherForm({ name: '', email: '', password: '', specialty: '' }); refetchTeachers(); })}>Save</Button>
                <Button variant="outlined" onClick={() => setShowTeacherModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showCourseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Typography variant="h6" mb={3}>Add Course</Typography>
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Course Name" value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Description" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Teacher ID" type="number" value={courseForm.teacherId} onChange={e => setCourseForm({...courseForm, teacherId: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Class ID" type="number" value={courseForm.classId} onChange={e => setCourseForm({...courseForm, classId: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Credit" type="number" value={courseForm.credit} onChange={e => setCourseForm({...courseForm, credit: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Schedule" value={courseForm.schedule} onChange={e => setCourseForm({...courseForm, schedule: e.target.value})} />
              <input className="w-full mb-4 px-3 py-2 border rounded" placeholder="Room" value={courseForm.room} onChange={e => setCourseForm({...courseForm, room: e.target.value})} />
              <div className="flex gap-2">
                <Button variant="contained" onClick={() => addCourse(courseForm).then(() => { setShowCourseModal(false); setCourseForm({ name: '', description: '', teacherId: '', classId: '', credit: 3, schedule: '', room: '' }); refetchCourses(); })}>Save</Button>
                <Button variant="outlined" onClick={() => setShowCourseModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showClassModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Typography variant="h6" mb={3}>Add Class</Typography>
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Class Name" value={classForm.name} onChange={e => setClassForm({...classForm, name: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Department" value={classForm.department} onChange={e => setClassForm({...classForm, department: e.target.value})} />
              <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Section" value={classForm.section} onChange={e => setClassForm({...classForm, section: e.target.value})} />
              <input className="w-full mb-4 px-3 py-2 border rounded" placeholder="Year" type="number" value={classForm.year} onChange={e => setClassForm({...classForm, year: e.target.value})} />
              <div className="flex gap-2">
                <Button variant="contained" onClick={() => addClass(classForm).then(() => { setShowClassModal(false); setClassForm({ name: '', department: '', section: '', year: 2024 }); refetchClasses(); })}>Save</Button>
                <Button variant="outlined" onClick={() => setShowClassModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}