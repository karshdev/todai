import TodaiCircularLoader from '@/components/loader/TodaiCircularLoader';
import React from 'react';
import VideoCard from './videoCard';

interface VideoListProps {
    data: any;
    isProcessing: boolean;
    setEditVideo: (video: { videoId: number; videoUrl: string }) => void;
}

const VideoList: React.FC<VideoListProps> = ({ data, isProcessing, setEditVideo }) => (
    <div className="mx-auto py-8">
        <div className="mx-auto flex flex-wrap items-center justify-center w-fit gap-4 ">
            {data?.clips?.map((video: any) => (
                // {data?.map((video: any) => (
                <VideoCard key={video.clip_id} video={video} setEditVideo={setEditVideo} />
            ))}
            {isProcessing && <div className="border max-w-sm h-[308px] w-[380px] rounded-lg overflow-hidden shadow-lg justify-self-start">
                <TodaiCircularLoader height='h-full' />
            </div>}
        </div>
    </div>
);

export default VideoList;
