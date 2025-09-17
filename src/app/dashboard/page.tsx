import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { classes } from '@/lib/data';
import { Users } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline tracking-tight">
          Good morning, Mr. Davison!
        </h2>
        <p className="text-muted-foreground">
          Select a class to begin taking attendance.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((classItem) => (
          <Link href={`/dashboard/class/${classItem.id}`} key={classItem.id}>
            <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                <Image
                  src={classItem.coverImageUrl}
                  alt={`Cover image for ${classItem.name}`}
                  width={600}
                  height={400}
                  data-ai-hint={classItem.coverImageHint}
                  className="aspect-video w-full object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="font-headline text-lg">{classItem.name}</CardTitle>
                <CardDescription>{classItem.subject}</CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{classItem.studentCount} Students</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
