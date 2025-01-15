'use client'
import { LinkedinIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';


const REDIRECT_URI = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/connect-linkedIn/callback`;
const LinkedInConnect: React.FC = () => {
    const router = useRouter();

    const handleLinkedInConnect = () => {
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=3904j3304m&scope=openid%20profile%20w_member_social%20email`;
        router.push(authUrl)
    };

    return (
        <div className="absolute flex flex-col items-center justify-center h-screen w-screen p-6 bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-lg w-full flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">Connect with LinkedIn</h1>
                <p className="text-gray-700 mb-6">
                    In order to post on your behalf, we would need to connect LinkedIn.
                </p>
                <button
                    onClick={handleLinkedInConnect}
                    className="shadow-2xl flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <LinkedinIcon className="w-5 h-5" />
                    Connect with LinkedIn
                </button>
            </div>
        </div>
    );
};

export default LinkedInConnect;


