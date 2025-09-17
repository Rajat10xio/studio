'use server';

/**
 * @fileOverview Enhances face recognition accuracy by using an LLM to analyze ambiguous cases and suggest possible matches.
 *
 * - enhanceFaceRecognition - A function that enhances face recognition by leveraging an LLM to analyze ambiguous cases and suggest matches.
 * - EnhanceFaceRecognitionInput - The input type for the enhanceFaceRecognition function.
 * - EnhanceFaceRecognitionOutput - The output type for the enhanceFaceRecognition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceFaceRecognitionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the unidentified face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  possibleMatches: z
    .array(z.string())
    .describe('A list of possible student names that may match the face.'),
  classRoster: z
    .string()
    .describe('The names of all students in the class, comma separated.'),
});
export type EnhanceFaceRecognitionInput = z.infer<
  typeof EnhanceFaceRecognitionInputSchema
>;

const EnhanceFaceRecognitionOutputSchema = z.object({
  suggestedMatch: z
    .string()
    .describe(
      'The name of the student that the LLM suggests is the best match, or null if no match is found.'
    ),
  confidence: z
    .number()
    .describe(
      'A confidence score (0-1) representing the LLM suggestion certainty.'
    ),
  reasoning: z
    .string()
    .describe('Explanation of why the LLM picked suggestedMatch'),
});
export type EnhanceFaceRecognitionOutput = z.infer<
  typeof EnhanceFaceRecognitionOutputSchema
>;

export async function enhanceFaceRecognition(
  input: EnhanceFaceRecognitionInput
): Promise<EnhanceFaceRecognitionOutput> {
  return enhanceFaceRecognitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceFaceRecognitionPrompt',
  input: {schema: EnhanceFaceRecognitionInputSchema},
  output: {schema: EnhanceFaceRecognitionOutputSchema},
  prompt: `You are an AI assistant that helps teachers with face recognition in the classroom.

A student\'s face has been detected, but the system is not confident about the match.
The system has identified these possible matches: {{{possibleMatches}}}.

Here is a picture of the face: {{media url=photoDataUri}}

Given the list of possible student matches and the attached picture, determine which student is the most likely match. Justify your reasoning, then return the single most likely student name.

Here is the class roster: {{{classRoster}}}.

If none of the listed possible matches are correct, choose an alternative name from the provided class roster.

If you cannot determine a match confidently, return null for suggestedMatch and explain why.

Output the student's name in suggestedMatch field, a confidence score (0-1) representing the certainty of the match in the confidence field, and the justification in the reasoning field.
`,
});

const enhanceFaceRecognitionFlow = ai.defineFlow(
  {
    name: 'enhanceFaceRecognitionFlow',
    inputSchema: EnhanceFaceRecognitionInputSchema,
    outputSchema: EnhanceFaceRecognitionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
