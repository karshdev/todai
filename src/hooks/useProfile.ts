// hooks/useProfile.js
import { getProfileData1 } from '@/lib/axios/api';
import { useQuery } from '@tanstack/react-query';

export const PROFILE_QUERY_KEY = ['profile'];

export function useProfile() {
    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: getProfileData1,
        select: (data: any) => data.data.data,
    });
}
