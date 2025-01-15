import { z } from "zod"

export const ProfileSchema = z.object({
    first_name: z
        .string()
        .regex(/^[a-zA-Z\s]+$/)
        .min(3)
        .max(15),
    last_name: z
        .string()
        .regex(/^[a-zA-Z\s]+$/)
        .min(3)
        .max(15),
})

export type Inputs = z.infer<typeof ProfileSchema>
export type ErrorMessage = { message: string }



export const ChangePasswordSchema = z.object({
    old_password: z
        .string()
        .min(6)
        .max(20),
    new_password: z
        .string()
        .min(6)
        .max(20),
    confirm_password: z
        .string()
        .min(6)
        .max(20)
    ,
}).superRefine(({ new_password, confirm_password }, ctx) => {
    if (new_password !== confirm_password) {
        ctx.addIssue({
            code: 'custom',
            path: ['confirm_password'],
            message: "Passwords don't match",
        })
        return false;
    }
})

export type ChangePasswordInputs = z.infer<typeof ChangePasswordSchema>