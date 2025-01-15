import { z } from 'zod'

export type SignupFields = {
    firstName: string
    lastName: string
    email: string
    password: string
}

export const SignUpSchema = z.object({
    firstName: z
        .string()
        .regex(/^[a-zA-Z\s]+$/)
        .min(3)
        .max(15),
    lastName: z
        .string()
        .regex(/^[a-zA-Z\s]+$/)
        .min(3)
        .max(15),
    email: z.string().email(),
    password: z.string().min(8).max(100),
})

export type SignUpSchemaType = z.infer<typeof SignUpSchema>
export type ErrorMessage = { message: string }
