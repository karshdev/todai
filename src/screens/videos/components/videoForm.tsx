import React from 'react';
import { TodaiAnimatedButton } from '@/components/button/TodaiAnimatedButton';
import TodaiInput from '@/components/TodaiInput';

interface VideoFormProps {
    clip_url: string;
    setClipUrl: (url: string) => void;
    handleSubmitVideoUrl: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ clip_url, setClipUrl, handleSubmitVideoUrl }) => (
    <form className="flex w-full justify-center">
        <div className='flex w-full lg:w-2/3 items-center justify-center rounded-full shadow-lg'>
            <TodaiInput
                value={clip_url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClipUrl(e.target.value)}
                type="text"
                placeholder="Paste your video link here"
                extra='w-full'
                inputClass="flex-grow w-full !border-r-0 !p-4 border border-brand-primary !rounded-l-full !rounded-r-none !outline-none focus-visible:!ring-brand-primary"
            />
            <TodaiAnimatedButton
                onClick={handleSubmitVideoUrl}
                type="button"
                variant='primary'
                className="p-3 !w-40 self-stretch border border-brand-primary !rounded-l-none border-l-0 hover:text-white rounded-r-full hover:!ring-brand-primary"
            >
                Submit
            </TodaiAnimatedButton>
        </div>
    </form>
);

export default VideoForm;