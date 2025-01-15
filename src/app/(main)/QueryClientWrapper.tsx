'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


// const queryClient = new QueryClient()

export default function QueryClientWrapper({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 60 * 1000, // 15 minutes
                gcTime: 30 * 60 * 1000, // 15 minutes
                retry: 2
            },
        },
    }))
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}