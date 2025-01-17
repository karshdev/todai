'use client'
import { useToast } from '@/components/ui/use-toast';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useVideoState } from '@/hooks/video/useVideoState';
import { createVideo, fetchVideoDetails } from '@/lib/axios/api';
import { isValidURL } from '@/lib/helper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import VideoForm from './components/videoForm';
import VideoList from './components/videoList';
import VideoTrimmer from './videoTrimmer/videoTrimmer';


const Video: React.FC = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { editVideo, setEditVideo } = useVideoState();
    const [loading, setLoading] = useState(false)
    const [videoId, setVideoId] = useState<number | null>(null);

    const [clip_url, setClipUrl] = useLocalStorage('clip_url', '');
    const [vid, setvid] = useLocalStorage('vid', '');

    useEffect(() => {
        const clearLocalStorage = () => {
            localStorage.removeItem('clip_url');
            localStorage.removeItem('vid');
        };
        window.addEventListener('beforeunload', clearLocalStorage);
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', clearLocalStorage);
        };
    }, []);

    const createVideoMutation = useMutation({
        mutationFn: (url: { url: string }) => createVideo(url),
        onSuccess: (response: any) => {
            const videoData = response?.data?.data;
            setVideoId(videoData.video_id);
            setvid(videoData.video_id)
            queryClient.setQueryData(['videoDetails', videoData.video_id], videoData);
        },
        onError: () => {
            setLoading(false)
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: "Please try again",
            });
        },
    });

    const { data, isLoading } = useQuery({
        queryKey: ['videoDetails', Number(vid)],
        queryFn: ({ queryKey }) => fetchVideoDetails(queryKey[1] as number),
        enabled: !!videoId,
        refetchInterval: (query: any) => {
            const data = query.state.data?.data?.data;
            if (!data) return 5000; // If no data yet, continue polling
            if (data.clips.length > 0 && !data.is_processing) {
                setLoading(false)
                return false; // stop polling
            }
            setLoading(true)
            return 5000;
        },
        select: (response: any) => response.data.data,
    });

    const handleSubmitVideoUrl = () => {
        queryClient.removeQueries({ queryKey: ['videoDetails', Number(vid)] })
        localStorage.removeItem('vid');
        setVideoId(null)
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
        setLoading(true)
        createVideoMutation.mutate({ url: clip_url });
    };

    return (
        <div className="w-full mx-auto">
            <header className='flex items-center flex-col mb-4'>
                <p className='text-xs text-slate-500'>Create</p>
                <h1 className='text-3xl font-bold'>Video</h1>
            </header>
            {editVideo.videoUrl === '' ? (
                <>
                    <VideoForm
                        clip_url={clip_url}
                        setClipUrl={setClipUrl}
                        handleSubmitVideoUrl={handleSubmitVideoUrl}
                    />
                    <VideoList
                        data={data}
                        isProcessing={loading}
                        setEditVideo={setEditVideo}
                    />
                </>
            ) : (
                <VideoTrimmer inputVideo={editVideo} setInputVideo={setEditVideo} />
            )}
        </div>
    );
}

export default Video;





// const videos = [
//     {
//         clip_id: 101,
//         ai_title: 'Video 1',
//         ai_description: 'This is the ai_description for video 1',
//         thumbnail_url: '/todai-video-stag/thumbnails/lNInDQLdx1mgJC45.png',
//         clip_url: '/todai-video-stag/clips/Pjz95Rs3T1UENoqh.mp4',
//     },
//     {
//         clip_id: 2,
//         ai_title: 'Video 2',
//         ai_description: 'This is the ai_description for video 2',
//         thumbnail_url: '/todai-video-stag/thumbnails/yI5hfOgxrK3F6ejq.png',
//         clip_url: '/todai-video-stag/clips/RrJTfBagdGNPV7F2.mp4',
//     },
//     {
//         clip_id: 3,
//         ai_title: 'Video 3',
//         ai_description: 'This is the ai_description for video 3',
//         thumbnail_url: '/todai-video-stag/thumbnails/yI5hfOgxrK3F6ejq.png',
//         clip_url: '/todai-video-stag/clips/TQr2x0LMXntO6AfJ.mp4',
//     },
//     {
//         clip_id: 4,
//         ai_title: 'Video 4',
//         ai_description: 'This is the ai_description for video 3',
//         thumbnail_url: '/todai-video-stag/thumbnails/yI5hfOgxrK3F6ejq.png',
//         clip_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//     },
//     // Add more video objects here...
// ];
