import React from 'react';

interface VideoPlayerProps {
    videoUrl: string;
    trimmedVideoFile: string | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = React.memo(({ videoUrl, trimmedVideoFile }) => {
    return (
        <div className="rounded-md">
            <video
                className='rounded-md h-[200px] xl:h-[500px] shadow-lg'
                src={trimmedVideoFile != null ? trimmedVideoFile : videoUrl}
                controls
                muted
                onError={() => console.error('Failed to load video. The URL might be invalid or the server doesn\'t allow video playback.')}
            ></video>
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer'
