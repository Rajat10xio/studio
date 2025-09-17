'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { attendanceRecords } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ReportsPage() {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: 'Exporting Reports',
      description: 'Your attendance report is being generated and will download shortly.',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Attendance Reports</CardTitle>
          <CardDescription>
            View and export attendance history for your classes.
          </CardDescription>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Present</TableHead>
              <TableHead className="text-center">Absent</TableHead>
              <TableHead className="text-center">Attendance Rate</TableHead>
              <TableHead>Confirmed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((record) => {
              const total = record.present + record.absent;
              const attendanceRate = total > 0 ? (record.present / total) * 100 : 0;
              return (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.className}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell className="text-center text-green-600 dark:text-green-400">{record.present}</TableCell>
                  <TableCell className="text-center text-red-600 dark:text-red-400">{record.absent}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={attendanceRate > 80 ? 'default' : 'destructive'} className={attendanceRate > 80 ? 'bg-green-500' : ''}>
                      {attendanceRate.toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{record.confirmedBy}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
