import React from 'react';

export const StudentIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" fill="#6366f1"/>
    <path d="M12 14C15.3137 14 18 11.7614 18 9C18 6.23858 15.3137 4 12 4C8.68629 4 6 6.23858 6 9C6 11.7614 8.68629 14 12 14Z" fill="#818cf8"/>
    <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const TeacherIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="7" r="4" fill="#7c3aed"/>
    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
    <rect x="9" y="10" width="6" height="2" rx="1" fill="#7c3aed"/>
  </svg>
);

export const BookIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" stroke="#10b981" strokeWidth="2"/>
  </svg>
);

export const CourseIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#0ea5e9" strokeWidth="2"/>
    <path d="M3 10H21" stroke="#0ea5e9" strokeWidth="2"/>
    <path d="M8 4V8" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const GradeIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#f59e0b"/>
  </svg>
);

export const ExamIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="#ef4444" strokeWidth="2"/>
    <path d="M8 6H16M8 10H16M8 14H12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const AttendanceIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#8b5cf6" strokeWidth="2"/>
    <path d="M16 2V6" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 2V6" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 10H21" stroke="#8b5cf6" strokeWidth="2"/>
    <path d="M8 14L11 17L16 12" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ClassIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 7L12 2L22 7V17L12 22L2 17V7Z" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M2 7L12 12L22 7" stroke="#6366f1" strokeWidth="2"/>
    <path d="M12 12V22" stroke="#6366f1" strokeWidth="2"/>
  </svg>
);

export const SchoolIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke="#7c3aed" strokeWidth="2"/>
  </svg>
);

export const AddIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="#10b981"/>
    <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SearchIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="8" stroke="#6366f1" strokeWidth="2"/>
    <path d="M21 21L16.65 16.65" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const EditIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DeleteIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 6H5H21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChatIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" fill="#8b5cf6"/>
  </svg>
);

export const BotIcon = ({ size = 20, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Ana Gövde / Kafa */}
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
    
    {/* Gözler yerine modern çizgi detayları */}
    <path d="M7 11V9a5 5 0 0 1 10 0v2" />
  </svg>
);

export const MinimizeIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 14H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SparklesIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3L13.5 6L17 6.5L14.5 9L15 12.5L12 11L9 12.5L9.5 9L7 6.5L10.5 6L12 3Z" fill="#f59e0b"/>
    <path d="M5 14L6 16.5L8.5 17.5L6.5 19.5L6 22L4 20.5L2 19.5L3.5 17.5L5 14Z" fill="#f59e0b"/>
    <path d="M19 14L20 16.5L22.5 17.5L20.5 19.5L20 22L18 20.5L16 19.5L17.5 17.5L19 14Z" fill="#f59e0b"/>
  </svg>
);

export const SendIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M22 2L11 13" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LockIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6366f1" strokeWidth="2"/>
    <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const EyeIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#6366f1" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" stroke="#6366f1" strokeWidth="2"/>
  </svg>
);

export const EyeOffIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6694 14.2048 20.84 15.19M3.515 4.929C1.53 6.43 0.458044 8.6696 0.430467 10.967" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
    <path d="M1 1L23 23" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const UserIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" stroke="#6366f1" strokeWidth="2"/>
    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MailIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#6366f1" strokeWidth="2"/>
    <path d="M22 6L12 13L2 6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MoreIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="2" fill="#6366f1"/>
    <circle cx="6" cy="12" r="2" fill="#6366f1"/>
    <circle cx="18" cy="12" r="2" fill="#6366f1"/>
  </svg>
);

export const CloseIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 6L6 18M6 6L18 18" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ArrowForwardIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MenuIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 12H21M3 6H21M3 18H21" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const LogoutIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 17L21 12L16 7M21 12H9" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SettingsIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" stroke="#6366f1" strokeWidth="2"/>
    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const DashboardIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#7c3aed" strokeWidth="2"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#7c3aed" strokeWidth="2"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#7c3aed" strokeWidth="2"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="#7c3aed" strokeWidth="2"/>
  </svg>
);

export const NotificationIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#f59e0b" strokeWidth="2"/>
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#f59e0b" strokeWidth="2"/>
  </svg>
);

export const EnrollmentIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M16 21V19C16 16.7909 14.2091 15 12 15H6C3.79086 15 2 16.7909 2 19V21" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="7" r="4" stroke="#10b981" strokeWidth="2"/>
    <path d="M19 8V14M16 11H22" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ChartIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 20V10M12 20V4M6 20V14" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CalendarIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#8b5cf6" strokeWidth="2"/>
    <path d="M16 2V6M8 2V6M3 10H21" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CheckIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default {
  StudentIcon,
  TeacherIcon,
  BookIcon,
  CourseIcon,
  GradeIcon,
  ExamIcon,
  AttendanceIcon,
  ClassIcon,
  SchoolIcon,
  AddIcon,
  SearchIcon,
  EditIcon,
  DeleteIcon,
  ChatIcon,
  BotIcon,
  SendIcon,
  SparklesIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  MailIcon,
  MoreIcon,
  CloseIcon,
  ArrowForwardIcon,
  MenuIcon,
  LogoutIcon,
  SettingsIcon,
  DashboardIcon,
  NotificationIcon,
  EnrollmentIcon,
  ChartIcon,
  CalendarIcon,
  CheckIcon,
  MinimizeIcon,
};