import '@/app/globals.css'
import { TodaiImage } from '@/components/TodaiImage'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthBg from '@/assets/img/authbg.jpeg'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Auth Todai',
    description: `It's time to use todai`,
    icons: {
        icon: "/img/favicon.ico",
    },
}

export default function RootLayout({
    children,
    params: { locale },
}: { children: React.ReactNode; params: any }) {
    return (
        <html lang={locale}>
            <body className={inter.className}>
                <div className='flex flex-col md:flex-row w-screen h-screen'>
                    <div className='w-full h-full bg-white text-black'>
                        {children}
                    </div>
                    <div className='w-full h-full'>
                        <TodaiImage src={AuthBg} alt='authBg' className='h-full w-full object-cover' width={1000} height={1000} />
                    </div>
                </div>
            </body>
        </html>
    )
}
