import { signInUser } from '@/lib/axios/api'
import { SignInSchema } from '@/screens/auth/types/signin'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import LinkedInProvider from "next-auth/providers/linkedin";

export const providers = [
    CredentialsProvider({
        credentials: {
            email: {
                label: 'Email:',
                type: 'text',
                placeholder: 'Enter Email',
            },
            password: {
                label: 'Password:',
                type: 'password',
                placeholder: 'Enter Password',
            },
        },
        async authorize(credentials, user: any) {
            console.log("🚀 ~ authorize ~ credentials:", credentials)
            const parsedData = SignInSchema.parse(credentials)
            try {
                const response = await signInUser(parsedData)
                console.log("🚀 ~ authorize ~ response:", response)
                if (response.status === 200) {
                    console.log("🚀 ~ authorize ~ response.status:", response.status)

                    user.access_token = response?.data?.access;
                    user.refresh_token = response?.data?.refresh;
                    return user
                }
                return null
            } catch (error) {
                return null
            }
        },
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
]
