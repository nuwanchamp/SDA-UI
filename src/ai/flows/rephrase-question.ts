// src/ai/flows/rephrase-question.ts
'use server';

/**
 * @fileOverview Rephrases a user's question using AI to optimize it for the backend LLM.
 *
 * - rephraseQuestion - A function that rephrases the question.
 * - RephraseQuestionInput - The input type for the rephraseQuestion function.
 * - RephraseQuestionOutput - The return type for the rephraseQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RephraseQuestionInputSchema = z.object({
  question: z.string().describe('The original question from the user.'),
});
export type RephraseQuestionInput = z.infer<typeof RephraseQuestionInputSchema>;

const RephraseQuestionOutputSchema = z.object({
  rephrasedQuestion: z.string().describe('The rephrased question for the LLM.'),
});
export type RephraseQuestionOutput = z.infer<typeof RephraseQuestionOutputSchema>;

export async function rephraseQuestion(input: RephraseQuestionInput): Promise<RephraseQuestionOutput> {
  return rephraseQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rephraseQuestionPrompt',
  input: {schema: RephraseQuestionInputSchema},
  output: {schema: RephraseQuestionOutputSchema},
  prompt: `You are an AI assistant whose job is to rephrase user questions to be more clear and effective for a language model.

Original Question: {{{question}}}

Rephrased Question:`,
});

const rephraseQuestionFlow = ai.defineFlow(
  {
    name: 'rephraseQuestionFlow',
    inputSchema: RephraseQuestionInputSchema,
    outputSchema: RephraseQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
