import { classes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { AttendanceView } from '@/components/attendance/attendance-view';

export default function ClassAttendancePage({ params }: { params: { classId: string } }) {
  const classInfo = classes.find((c) => c.id === params.classId);

  if (!classInfo) {
    notFound();
  }

  return <AttendanceView classInfo={classInfo} />;
}

export function generateStaticParams() {
    return classes.map((classItem) => ({
        classId: classItem.id,
    }));
}
