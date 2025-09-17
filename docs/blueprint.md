# **App Name**: FaceAttend

## Core Features:

- Teacher Authentication: Secure teacher login using Firebase Authentication.
- Class Selection: Select a class from a list to take attendance for that class.
- Face Detection and Recognition: Detect and recognize student faces using the device's camera, leveraging facial recognition AI. Use a tool to determine if face matches photo reference well enough for automated positive identification.
- Attendance Summary: Display a summary of attendance, including total students, recognized students (present), and not found students (absent).
- Attendance Confirmation: Allow the teacher to review the attendance summary and confirm attendance.
- Attendance Logging: Store attendance logs in Firestore, including class ID, date, present students, absent students, and the teacher who confirmed attendance.
- Report Generation: Generate and export attendance reports.

## Style Guidelines:

- Background color: Light gray (#F5F5F5) to provide a clean, neutral base.
- Primary color: Soft blue (#64B5F6) for a calming and professional feel, hinting at reliability and trust, crucial for an educational app.
- Accent color: Teal (#4DB6AC) to highlight key interactive elements and actions.
- Body and headline font: 'PT Sans', a humanist sans-serif that combines a modern look and a little warmth or personality, suitable for both headlines and body text.
- Use clear, modern icons to represent actions and status.
- Clean and intuitive layout with a focus on usability for teachers.
- Subtle animations for feedback on face detection and attendance confirmation.