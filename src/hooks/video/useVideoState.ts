import { useState } from 'react';

export const useVideoState = () => {
    const [editVideo, setEditVideo] = useState<{ videoId: number; videoUrl: string }>({ videoId: 0, videoUrl: '' });
    const [clip_url, setClipUrl] = useState<string>('');

    return { editVideo, setEditVideo, clip_url, setClipUrl };
};


// 38687759473-c24psuvoomin3629hqijc70gnrnlq3ub.apps.googleusercontent.com
// AIzaSyB_SECx2sDpAa2YF-isOGYR3QkbNOeLybU
