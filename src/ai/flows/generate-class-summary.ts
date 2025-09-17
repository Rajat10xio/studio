'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a summary of class attendance, including attendance rate,
 *               notable absences, and observed patterns.
 *
 * - generateClassSummary - An async function that takes class details and attendance records to produce a summary.
 * - GenerateClassSummaryInput - The input type for the generateClassSummary function.
 * - GenerateClassSummaryOutput - The return type for the generateClassSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateClassSummaryInputSchema = z.object({
  classId: z.string().describe('The ID of the class.'),
  date: z.string().describe('The date for which the attendance is being summarized (YYYY-MM-DD).'),
  presentStudents: z.array(z.string()).describe('An array of student IDs who are present.'),
  absentStudents: z.array(z.string()).describe('An array of student IDs who are absent.'),
  totalStudents: z.number().describe('The total number of students in the class.'),
});

export type GenerateClassSummaryInput = z.infer<typeof GenerateClassSummaryInputSchema>;

const GenerateClassSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the class attendance, including attendance rate, notable absences, and any patterns observed.'),
});

export type GenerateClassSummaryOutput = z.infer<typeof GenerateClassSummaryOutputSchema>;

export async function generateClassSummary(input: GenerateClassSummaryInput): Promise<GenerateClassSummaryOutput> {
  return generateClassSummaryFlow(input);
}

const generateClassSummaryPrompt = ai.definePrompt({
  name: 'generateClassSummaryPrompt',
  input: {schema: GenerateClassSummaryInputSchema},
  output: {schema: GenerateClassSummaryOutputSchema},
  prompt: `You are a helpful AI assistant that helps teachers summarize class attendance.

  Given the following information, generate a brief summary of the class attendance, including overall attendance rate, notable absences, and any patterns observed.

  Class ID: {{{classId}}}
  Date: {{{date}}}
  Total Students: {{{totalStudents}}}
  Present Students: {{#each presentStudents}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Absent Students: {{#each absentStudents}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Summary:`,
});

const generateClassSummaryFlow = ai.defineFlow(
  {
    name: 'generateClassSummaryFlow',
    inputSchema: GenerateClassSummaryInputSchema,
    outputSchema: GenerateClassSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateClassSummaryPrompt(input);
    return output!;
  }
);
