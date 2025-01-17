import { z } from 'zod'

export type SigninFields = {
    email: string
    password: string
}

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: 'Field is required' }),
})

export type SignInSchemaType = z.infer<typeof SignInSchema>
export type ErrorMessage = { message: string }
