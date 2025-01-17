import axios from "axios";
import { SignUpSchema, SignupFields } from "../types/signup";
import { signUpUser } from "@/lib/axios/api";

export async function handleSignUpAction(data: SignupFields) {
    const parsedData = SignUpSchema.parse(data);
    try {
        const formData = new FormData();
        formData.append('first_name', parsedData.firstName);
        formData.append('last_name', parsedData.lastName);
        formData.append('email', parsedData.email);
        formData.append('password', parsedData.password);
        const signUp = await signUpUser(formData)
        if (signUp.status === 201) {
            return {
                status: 201,
                title: 'Your account has been created successfully!',
                description: 'Please continue to login',
            };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("🚀 ~ handleSignUpAction ~ error:", error)
            const status = error.response?.status;
            const message = error.response?.data?.email[0];

            if (status === 400) {
                return {
                    title: 'Signup failed',
                    description: message || 'Invalid input. Please check your data and try again.',
                    status: 400,
                };
            } else if (status === 500) {
                return {
                    title: 'Server error',
                    description: 'There is a problem with the server. Please try again later.',
                    status: 500,
                };
            } else if (status === 502) {
                return {
                    title: 'Bad gateway',
                    description: 'The server is temporarily unavailable. Please try again later.',
                    status: 502,
                };
            }
        }
        return defaultError();
    }
}

const defaultError = () => ({
    title: 'Something went wrong',
    description: 'Please try again after sometime. Contact mail@tadai.com for support',
    status: 400,
});
