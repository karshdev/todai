import { socialAuthGoogle } from "@/lib/axios/api";
import NextAuth from 'next-auth';
import { providers } from "./authProviders";

const handler = NextAuth({
    session: {
        strategy: 'jwt',
        // maxAge: 60
    },
    // pages: {
    //    signIn: '/en/login/email',
    // },

    providers: providers,
    callbacks: {
        async signIn({ user, account, profile }: any) {
            if (account && account?.id_token) {
                try {
                    const token = { "auth_token": account.id_token }
                    const response = await socialAuthGoogle(token)
                    if (response.status === 200) {
                        user.access_token = response?.data?.data?.tokens?.access;
                        user.refresh_token = response?.data?.data?.tokens?.refresh;
                        user.email = response?.data?.data?.email
                        return true
                    } else {
                        return false;
                    }
                } catch (error) {
                    console.error('API call failed:', error);
                    return false;
                }
            }

            return true;
        },
        async jwt({ token, user, account }: any) {
            // Persist the access and refresh tokens in the JWT
            if (user) {
                token.access_token = user.access_token;
                token.refresh_token = user.refresh_token;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }: any) {
            session.access_token = token.access_token;
            session.refresh_token = token.refresh_token;
            session.email = token.email;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl; // Redirect to the homepage
        },
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            }
        }
    }
})

export { handler as GET, handler as POST };
