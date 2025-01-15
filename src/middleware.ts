// import { getToken } from 'next-auth/jwt';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';
// import { getProfileData } from './lib/axios/api';

// export async function middleware(req: NextRequest) {
//     try {
//         const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//         const token = jwt?.access_token as string;

//         const publicPaths = ['/signin', '/signup', '/reset-password'];
//         const excludedPaths = ['/onboarding', '/connect-linkedIn', '/connect-linkedIn/callback'];
//         const isPublicPath = publicPaths.includes(req.nextUrl.pathname);
//         const isExcludedPath = excludedPaths.includes(req.nextUrl.pathname);

//         if (!token && !isPublicPath) {
//             return NextResponse.redirect(new URL('/signin', req.url));
//         }

//         if (token && isPublicPath) {
//             return NextResponse.redirect(new URL('/', req.url));
//         }


//         // Allow the request to proceed for all other cases
//         return NextResponse.next();
//     } catch (error) {
//         console.error('Middleware error:', error);
//         return NextResponse.redirect(new URL('/signin', req.url));
//     }
// }

// export const config = {
//     matcher: [
//         '/((?!api|_next/static|_next/image|favicon.ico).*)',
//     ],
// };


// import { getToken } from 'next-auth/jwt';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// export async function middleware(req: NextRequest) {
//     try {
//         const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//         const token = jwt?.access_token as string;

//         const publicPaths = ['/signin', '/signup', '/reset-password'];
//         const excludedPaths = ['/onboarding', '/connect-linkedIn', '/connect-linkedIn/callback'];
//         const isPublicPath = publicPaths.includes(req.nextUrl.pathname);
//         const isExcludedPath = excludedPaths.includes(req.nextUrl.pathname);

//         // First, handle basic authentication checks
//         if (!token && !isPublicPath) {
//             return NextResponse.redirect(new URL('/signin', req.url));
//         }

//         if (token && isPublicPath) {
//             return NextResponse.redirect(new URL('/', req.url));
//         }

//         // If token exists, perform additional profile-based routing
//         if (token) {
//             try {
//                 // Use the full URL for the profile API
//                 const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile/`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 if (!profileResponse.ok) {
//                     throw new Error('Failed to fetch profile data');
//                 }

//                 const { data } = await profileResponse.json();
//                 const stepOn = data?.step_on;

//                 switch (stepOn) {
//                     case "SUBSCRIPTION":
//                         if (req.nextUrl.pathname !== '/subscription') {
//                             return NextResponse.redirect(new URL('/subscription', req.url));
//                         }
//                         break;
//                     case "INTEREST":
//                         if (req.nextUrl.pathname !== '/onboarding') {
//                             return NextResponse.redirect(new URL('/onboarding', req.url));
//                         }
//                         break;
//                     case "LINKEDINCONN":
//                         if (req.nextUrl.pathname !== '/connect-linkedIn') {
//                             return NextResponse.redirect(new URL('/connect-linkedIn', req.url));
//                         }
//                         break;
//                     case "COMPLETED":
//                         // If already on a valid page, continue
//                         if (isExcludedPath || publicPaths.includes(req.nextUrl.pathname)) {
//                             return NextResponse.redirect(new URL('/', req.url));
//                         }
//                         else if(req.nextUrl.pathname == '/') {
//                             return NextResponse.redirect(new URL('/help/features', req.url));
//                         }
//                         break;
//                     default:
//                         // No specific routing required
//                         break;
//                 }
//             } catch (profileError) {
//                 console.error("Error fetching profile data in middleware:", profileError);
//                 // If profile fetch fails, redirect to signin to ensure security
//                 return NextResponse.redirect(new URL('/signin', req.url));
//             }
//         }

//         // Allow the request to proceed for all other cases
//         return NextResponse.next();
//     } catch (error) {
//         console.error('Middleware error:', error);
//         return NextResponse.redirect(new URL('/signin', req.url));
//     }
// }

// export const config = {
//     matcher: [
//         '/((?!api|_next/static|_next/image|favicon.ico).*)',
//     ],
// };


import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    try {
        const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        // Define path arrays
        const publicPaths = ['/signin', '/signup', '/reset-password'];
        const excludedPaths = ['/onboarding', '/connect-linkedIn', '/connect-linkedIn/callback'];
        const systemPaths = ['/', '/subscription', '/profile', '/onboarding', '/connect-linkedIn', '/connect-linkedIn/callback', '/video/todai_quick_start.mp4'];

        const currentPath = req.nextUrl.pathname;
        const isPublicPath = publicPaths.includes(currentPath);
        const isExcludedPath = excludedPaths.includes(currentPath);
        const isSystemPath = systemPaths.includes(currentPath);


        if (currentPath.startsWith('/fonts/')) {
            return NextResponse.next();
        }
        // Handle public paths without token
        if (!jwt && isPublicPath) {
            return NextResponse.next();
        }

        // Redirect unauthenticated users to signin
        if (!jwt && !isPublicPath) {
            return NextResponse.redirect(new URL('/signin', req.url));
        }

        // Redirect authenticated users away from public paths
        if (jwt && isPublicPath) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // For authenticated users, check profile and routing
        if (jwt) {
            try {
                const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwt.access_token || ''}`,
                        'Content-Type': 'application/json'
                    },
                    cache: 'no-store'
                });

                if (!profileResponse.ok) {
                    throw new Error(`Profile fetch failed: ${profileResponse.status}`);
                }

                const { data } = await profileResponse.json();
                const stepOn = data?.step_on;
                const allowedRoutes = data?.app_routes || [];

                // Special handling for callback route
                if (currentPath === '/connect-linkedIn/callback') {
                    return NextResponse.next();
                }

                // Step-based routing logic
                switch (stepOn) {
                    case "SUBSCRIPTION":
                        if (currentPath !== '/subscription' && !isPublicPath) {
                            return NextResponse.redirect(new URL('/subscription', req.url));
                        }
                        break;

                    case "INTEREST":
                        if (currentPath !== '/onboarding' && !isPublicPath) {
                            return NextResponse.redirect(new URL('/onboarding', req.url));
                        }
                        break;

                    case "LINKEDINCONN":
                        if (currentPath !== '/connect-linkedIn' &&
                            currentPath !== '/connect-linkedIn/callback' &&
                            !isPublicPath) {
                            return NextResponse.redirect(new URL('/connect-linkedIn', req.url));
                        }
                        break;

                    case "COMPLETED":
                        if (currentPath === '/') {
                            return NextResponse.redirect(new URL('/help/features', req.url));
                        }

                        // Only check route permissions for non-system paths
                        if (!isSystemPath && !isPublicPath) {
                            const hasPermission = allowedRoutes.includes(currentPath);
                            if (!hasPermission) {
                                console.log(`Access denied to route: ${currentPath}`);
                                return NextResponse.redirect(new URL('/help/features', req.url));
                            }
                        }
                        break;

                    default:
                        // Handle unknown steps by redirecting to home
                        if (!isPublicPath && !isSystemPath) {
                            return NextResponse.redirect(new URL('/', req.url));
                        }
                        break;
                }
            } catch (profileError) {
                console.error("Error fetching profile data:", profileError);

                // If profile fetch fails, clear session and redirect to signin
                if (profileError instanceof Error && profileError.message.includes('401')) {
                    return NextResponse.redirect(new URL('/signin', req.url));
                }

                // For other errors, proceed to home page
                return NextResponse.redirect(new URL('/', req.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/signin', req.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};