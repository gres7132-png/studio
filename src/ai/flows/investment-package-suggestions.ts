'use server';

/**
 * @fileOverview Suggests investment packages based on user profile and investment history.
 *
 * - suggestInvestmentPackages - A function that suggests investment packages.
 * - SuggestInvestmentPackagesInput - The input type for the suggestInvestmentPackages function.
 * - SuggestInvestmentPackagesOutput - The return type for the suggestInvestmentPackages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInvestmentPackagesInputSchema = z.object({
  userProfile: z
    .string()
    .describe('The profile of the user, including investment history.'),
});
export type SuggestInvestmentPackagesInput = z.infer<
  typeof SuggestInvestmentPackagesInputSchema
>;

const SuggestInvestmentPackagesOutputSchema = z.object({
  suggestedPackages: z
    .array(z.string())
    .describe('Suggested investment packages for the user.'),
});
export type SuggestInvestmentPackagesOutput = z.infer<
  typeof SuggestInvestmentPackagesOutputSchema
>;

export async function suggestInvestmentPackages(
  input: SuggestInvestmentPackagesInput
): Promise<SuggestInvestmentPackagesOutput> {
  return suggestInvestmentPackagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInvestmentPackagesPrompt',
  input: {schema: SuggestInvestmentPackagesInputSchema},
  output: {schema: SuggestInvestmentPackagesOutputSchema},
  prompt: `You are an investment advisor. Based on the user profile and investment history provided, suggest investment packages that would be suitable for the user.

User Profile and Investment History: {{{userProfile}}}

Suggest investment packages:`,
});

const suggestInvestmentPackagesFlow = ai.defineFlow(
  {
    name: 'suggestInvestmentPackagesFlow',
    inputSchema: SuggestInvestmentPackagesInputSchema,
    outputSchema: SuggestInvestmentPackagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
