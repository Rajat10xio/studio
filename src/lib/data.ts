import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string, fallback: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  return img ? { url: img.imageUrl, hint: img.imageHint } : { url: fallback, hint: '' };
};

export type Student = {
  id: string;
  name: string;
  avatarUrl: string;
  avatarHint: string;
};

export type Class = {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  students: Student[];
  coverImageUrl: string;
  coverImageHint: string;
};

export type AttendanceRecord = {
  id: string;
  classId: string;
  className: string;
  date: string;
  present: number;
  absent: number;
  confirmedBy: string;
};

const studentData: { id: string; name: string }[] = [
  { id: 's1', name: 'Alice Johnson' },
  { id: 's2', name: 'Bob Williams' },
  { id: 's3', name: 'Charlie Brown' },
  { id: 's4', name: 'Diana Miller' },
  { id: 's5', name: 'Ethan Davis' },
  { id: 's6', name: 'Fiona Garcia' },
  { id: 's7', name: 'George Rodriguez' },
  { id: 's8', name: 'Hannah Martinez' },
  { id: 's9', name: 'Ian Hernandez' },
  { id: 's10', name: 'Julia Lopez' },
  { id: 's11', name: 'Kevin Gonzalez' },
  { id: 's12', name: 'Laura Wilson' },
];

export const students: Student[] = studentData.map(s => {
  const { url, hint } = findImage(s.id, 'https://picsum.photos/seed/s_fallback/100/100');
  return {
    id: s.id,
    name: s.name,
    avatarUrl: url,
    avatarHint: hint,
  };
});

const classData = [
  { id: 'math101', name: 'Algebra 1', subject: 'Mathematics', studentIds: studentData.map(s => s.id) },
  { id: 'phy201', name: 'Physics I', subject: 'Science', studentIds: studentData.slice(0, 10).map(s => s.id) },
  { id: 'eng301', name: 'American Literature', subject: 'English', studentIds: studentData.slice(0, 8).map(s => s.id) },
  { id: 'his102', name: 'World History', subject: 'History', studentIds: studentData.slice(0, 11).map(s => s.id) },
];

export const classes: Class[] = classData.map(c => {
  const { url, hint } = findImage(`c${c.id.slice(-3, -2)}`, 'https://picsum.photos/seed/c_fallback/600/400');
  const classStudents = c.studentIds.map(id => students.find(s => s.id === id)!);
  
  return {
    id: c.id,
    name: c.name,
    subject: c.subject,
    students: classStudents,
    studentCount: classStudents.length,
    coverImageUrl: url,
    coverImageHint: hint,
  };
});


export const attendanceRecords: AttendanceRecord[] = [
  { id: 'r1', classId: 'math101', className: 'Algebra 1', date: '2024-05-20', present: 11, absent: 1, confirmedBy: 'Mr. Davison' },
  { id: 'r2', classId: 'phy201', className: 'Physics I', date: '2024-05-20', present: 9, absent: 1, confirmedBy: 'Mr. Davison' },
  { id: 'r3', classId: 'eng301', className: 'American Literature', date: '2024-05-19', present: 8, absent: 0, confirmedBy: 'Mr. Davison' },
  { id: 'r4', classId: 'his102', className: 'World History', date: '2024-05-19', present: 10, absent: 1, confirmedBy: 'Mr. Davison' },
  { id: 'r5', classId: 'math101', className: 'Algebra 1', date: '2024-05-18', present: 12, absent: 0, confirmedBy: 'Mr. Davison' },
];
