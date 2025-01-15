'use client'
import playButton from '@/assets/img/play-button.svg';
import { TodaiImage } from '@/components/TodaiImage';
import { TodaiAnimatedButton } from '@/components/button/TodaiAnimatedButton';
import TodaiDialog from '@/components/dialog/TodaiDialog';
import { Send } from 'lucide-react';
import React from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type VideoCardProps = {
  video: any;
  setEditVideo: (video: { videoId: number; videoUrl: string }) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, setEditVideo }) => {
console.log("🚀 ~ video:", video)

  return (
    <div className="border max-w-sm rounded-lg overflow-hidden shadow-lg justify-self-start">
      <div className="w-full">

        <TodaiDialog
          triggerContent={<div className='relative w-full'>
            {/* <TodaiImage
              width={500}
              height={700}
              src={`${BASE_URL}${video.thumbnail_url}`}
              alt={video.ai_title}
              className="w-full h-auto min-h-40 object-cover cursor-pointer"
            /> */}
            <video
              src={`${BASE_URL}${video.clip_url}`}
              className="w-full min-w-80 max-h-72 object-cover rounded-md rounded-b-none"
              autoPlay={false}
              // controlsList='nodownload'
              poster={`${BASE_URL}${video.thumbnail_url}`}
              preload="auto"
            />
            <div className=' p-8 absolute left-1/2 top-1/2 text-slate-700 h-8 w-8 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-black rounded-full bg-opacity-30 flex items-center justify-center'>
              <TodaiImage
                width={50}
                height={70}
                src={playButton}
                alt={video.ai_title}
                className=" min-h-8 min-w-8 cursor-pointer"
              />
            </div>
          </div>}
          extraClass='!gap-0'
          dialogWidth='!w-[90%]'
          open
          content={<video
            controls
            src={`${BASE_URL}${video.clip_url}`}
            className="w-full max-h-fit rounded-md bg-black"
            autoPlay
            controlsList='nodownload'
            poster={`${BASE_URL}${video.thumbnail_url}`}
            preload="auto"
          />} />
      </div>
      <div className="p-4">
        <div className="p-1 gap-3 flex flex-1 items-center mt-2">
          <TodaiAnimatedButton
            onClick={() => setEditVideo({ videoId: video.clip_id, videoUrl: `${BASE_URL}${video.clip_url}` })}
            type='button'
            variant='primary'
            className='!w-full !px-6 !rounded-3xl !text-brand-primary border bg-transparent hover:!text-white'
          >
            <div className='flex gap-1 text-center text-xs items-center justify-center'>
              Edit & Post <Send className='opacity-35 w-4 h-4' />
            </div>
          </TodaiAnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;


