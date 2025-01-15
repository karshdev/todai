import { useToast } from '@/components/ui/use-toast';
import { createVideo, fetchVideoDetails } from '@/lib/axios/api';
import { isValidURL } from '@/lib/helper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useVideoProcessing = (clip_url: string) => {
    const { toast } = useToast();
    // const queryClient = useQueryClient();
    const [videoId, setVideoId] = useState<number | null>(null);
    const [isLoading, setIsProcessing] = useState(false);



    const handleSubmitVideoUrl = () => {
        if (clip_url !== '' && !isValidURL(clip_url)) {
            toast({
                variant: "destructive",
                title: "The input text is not a valid URL.",
                description: "Please provide a valid YouTube, Vimeo, Dailymotion, or Twitch URL to create your video.",
            });
            return;
        }
        if (clip_url === '' || clip_url === undefined) {
            toast({
                variant: "destructive",
                title: "URL Missing!",
                description: "Please provide a valid YouTube, Vimeo, Dailymotion, or Twitch URL to create your video.",
            });
            return;
        }
        fetchData();
    };

    const fetchData = async () => {
        try {
            setIsProcessing(true);
            const url = { "url": clip_url };
            const response = await createVideo(url);
            if (response?.data?.data.is_processing && response?.data?.data.clips.length === 0) {
                // pollForClips(response.data.data.video_id);
                setVideoId(response?.data?.data.video_id);
            } else {
                // setData(response.data.data);
                setIsProcessing(false);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: "Please try again",
            });
            console.error('Error fetching initial data:', error);
        }
    };

    const { data, isLoading: isProcessing, refetch } = useQuery({
        queryKey: ['videoDetails', videoId],
        queryFn: () => fetchVideoDetails(videoId!),
        enabled: !!videoId,
        refetchInterval: (data: any) => {
            if (data?.clips.length > 0 || !data?.is_processing) {
                return false; // stop polling
            }
            return 5000; // continue polling every 5 seconds
        },
        select: (response) => response.data.data,
    });

    return {
        data,
        isProcessing: isProcessing,
        handleSubmitVideoUrl
    };
};


// import { useState, useEffect } from 'react';
// import { useToast } from '@/components/ui/use-toast';
// import { isValidURL } from '@/lib/helper';
// import { createVideo, fetchVideoDetails } from '@/lib/axios/api';

// export const useVideoProcessing = (clip_url: string) => {
//     const { toast } = useToast();
//     const [data, setData] = useState<any>(null);
//     const [isProcessing, setIsProcessing] = useState(false);

//     const handleSubmitVideoUrl = () => {
//         if (clip_url !== '' && !isValidURL(clip_url)) {
//             toast({
//                 variant: "destructive",
//                 title: "The input text is not a valid URL.",
//                 description: "Please provide a valid YouTube, Vimeo, Dailymotion, or Twitch URL to create your video.",
//             });
//             return;
//         }
//         if (clip_url === '' || clip_url === undefined) {
//             toast({
//                 variant: "destructive",
//                 title: "URL Missing!",
//                 description: "Please provide a valid YouTube, Vimeo, Dailymotion, or Twitch URL to create your video.",
//             });
//             return;
//         }
//         fetchData();
//     };

//     const fetchData = async () => {
//         try {
//             setIsProcessing(true);
//             const url = { "url": clip_url };
//             const response = await createVideo(url);
//             if (response?.data?.data.is_processing && response?.data?.data.clips.length === 0) {
//                 pollForClips(response.data.data.video_id);
//             } else {
//                 setData(response.data.data);
//                 setIsProcessing(false);
//             }
//         } catch (error) {
//             toast({
//                 variant: "destructive",
//                 title: "Something went wrong!",
//                 description: "Please try again",
//             });
//             console.error('Error fetching initial data:', error);
//         }
//     };

//     const pollForClips = async (videoId: number) => {
//         const interval = setInterval(async () => {
//             try {
//                 const response = await fetchVideoDetails(videoId);
//                 if (response?.data?.data.clips.length > 0) {
//                     setData(response.data.data);
//                     setIsProcessing(false);
//                 }
//                 if (!response?.data?.data.is_processing) {
//                     clearInterval(interval);
//                 }
//             } catch (error) {
//                 console.error('Error polling for clips:', error);
//             }
//         }, 5000);
//     };

//     return { data, isProcessing, handleSubmitVideoUrl };
// };


// // https://youtu.be/0HjDpPnxcP0?si=zIq1YHExkYDjenlj
