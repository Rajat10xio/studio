'use client';

import { useState, useRef, useEffect } from 'react';
import type { Class, Student } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Camera, Check, Loader, User, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { generateClassSummary } from '@/ai/flows/generate-class-summary';

export function AttendanceView({ classInfo }: { classInfo: Class }) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [presentStudents, setPresentStudents] = useState<Student[]>([]);
  const [absentStudents, setAbsentStudents] = useState<Student[]>(classInfo.students);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Turn off camera when component unmounts
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleCamera = async () => {
    if (isCameraOn) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Camera Error',
          description: 'Could not access the camera. Please check permissions.',
        });
      }
    }
  };

  const startScan = () => {
    if (!isCameraOn) {
      toast({
        variant: 'destructive',
        title: 'Camera is Off',
        description: 'Please turn on the camera before scanning.',
      });
      return;
    }
    setIsScanning(true);
    setScanProgress(0);
    setSummary(null);

    const studentsToScan = [...absentStudents];
    const scanDuration = 3000; // 3 seconds
    const intervalTime = scanDuration / studentsToScan.length;

    studentsToScan.forEach((student, index) => {
      setTimeout(() => {
        // Simulate recognition: 85% chance
        if (Math.random() < 0.85) {
          setPresentStudents((prev) => [...prev, student]);
          setAbsentStudents((prev) => prev.filter((s) => s.id !== student.id));
        }
        setScanProgress(((index + 1) / studentsToScan.length) * 100);
      }, (index + 1) * intervalTime);
    });

    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: 'Scan Complete',
        description: 'Review the attendance and confirm.',
      });
      generateSummary();
    }, scanDuration + 500);
  };
  
  const generateSummary = async () => {
    setIsSummaryLoading(true);
    try {
        const result = await generateClassSummary({
            classId: classInfo.id,
            date: new Date().toISOString().split('T')[0],
            presentStudents: presentStudents.map(s => s.name),
            absentStudents: absentStudents.map(s => s.name),
            totalStudents: classInfo.studentCount
        });
        setSummary(result.summary);
    } catch (error) {
        console.error("Error generating summary:", error);
        setSummary("Could not generate AI summary.");
    } finally {
        setIsSummaryLoading(false);
    }
  }

  const confirmAttendance = () => {
    toast({
      title: 'Attendance Confirmed!',
      description: `Attendance for ${classInfo.name} has been logged.`,
      action: <div className="p-2 rounded-full bg-green-500"><Check className="text-white"/></div>
    });
  };

  const StudentPill = ({ student, isPresent }: { student: Student, isPresent: boolean }) => (
    <div className={cn("flex items-center gap-2 rounded-full border p-1 pr-3 transition-all duration-300", isPresent ? 'bg-green-100/50 dark:bg-green-900/50 border-green-200 dark:border-green-800' : 'bg-red-100/50 dark:bg-red-900/50 border-red-200 dark:border-red-800')}>
      <Avatar className="h-7 w-7">
        <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint={student.avatarHint}/>
        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{student.name}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Camera View</span>
                    <Badge variant={isCameraOn ? "default" : "secondary"} className={cn(isCameraOn && "bg-green-500")}>
                        {isCameraOn ? 'ON' : 'OFF'}
                    </Badge>
                </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={cn('h-full w-full object-cover', { 'hidden': !isCameraOn })}
              />
              {!isCameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Camera className="h-12 w-12" />
                  <p>Camera is off</p>
                </div>
              )}
              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 text-white backdrop-blur-sm">
                  <Loader className="h-10 w-10 animate-spin" />
                  <p className="text-lg font-semibold">Scanning for students...</p>
                  <Progress value={scanProgress} className="w-1/2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>AI Generated Summary</CardTitle>
            </CardHeader>
            <CardContent>
                {isSummaryLoading && <p className='text-muted-foreground'>Generating summary...</p>}
                {summary && <p className="text-muted-foreground">{summary}</p>}
                {!summary && !isSummaryLoading && <p className="text-muted-foreground">Scan to generate an attendance summary.</p>}
            </CardContent>
        </Card>

      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button onClick={toggleCamera} variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            </Button>
            <Button onClick={startScan} disabled={isScanning || !isCameraOn}>
              {isScanning ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <path d="M12 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2" />
                </svg>
              )}
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-green-600 dark:text-green-400">
                <Check /> Present ({presentStudents.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {presentStudents.length > 0 ? presentStudents.map(s => <StudentPill key={s.id} student={s} isPresent={true} />) : <p className="text-sm text-muted-foreground">No students marked present yet.</p>}
              </div>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-red-400">
                <X /> Absent ({absentStudents.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {absentStudents.length > 0 ? absentStudents.map(s => <StudentPill key={s.id} student={s} isPresent={false} />) : <p className="text-sm text-muted-foreground">All students are present!</p>}
              </div>
            </div>
            <Button onClick={confirmAttendance} size="lg" className="w-full" disabled={isScanning || presentStudents.length + absentStudents.length === 0}>
                Confirm Attendance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
