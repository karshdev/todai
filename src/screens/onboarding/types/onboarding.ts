import { z } from 'zod';

export const OnboardingSchema = z.object({
    interest: z.array(z.string()).nonempty("At least one interest must be selected"),
    tone_of_voice: z.string().min(1, 'Field is required'),
    instructions: z.string().min(1, 'Instruction is required')
});
