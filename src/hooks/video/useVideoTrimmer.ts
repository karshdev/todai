import * as helpers from '@/lib/helper';
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useCallback, useEffect, useRef, useState } from 'react';

let FF: FFmpeg;

export const useVideoTrimming = (inputVideo: { videoId: number, videoUrl: string }) => {
  const [trimmedVideoFile, setTrimmedVideoFile] = useState(null);
  const [videoMeta, setVideoMeta] = useState<any>(null);
  const [trimIsProcessing, setTrimIsProcessing] = useState(false);
  const [rStart, setRstart] = useState(0);
  const [rEnd, setRend] = useState(10);
  const [thumbNails, setThumbNails] = useState<string[]>([]);
  const [thumbnailIsProcessing, setThumbnailIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectLoading, setAspectLoading] = useState<boolean>(false)
  const originalVideoData = useRef<any>(null);

  const loadFFmpeg = useCallback(async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';
    FF = new FFmpeg();
    try {
      await FF.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      setError('Failed to load FFmpeg. Please check your internet connection and try again.');
    }
  }, []);

  const handleLoadVideo = useCallback(async () => {
    if (!inputVideo.videoUrl) {
      setError('Please enter a video URL');
      return;
    }

    setError(null);
    setVideoMeta(null);
    setThumbNails([]);

    try {
      const response = await fetch(inputVideo.videoUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const file = new File([blob], "input.mp4", { type: "video/mp4" });

      originalVideoData.current = file;//setting this for aspect ration operation
      const fileURL = URL.createObjectURL(file);
      setVideoMeta({
        name: file.name,
        duration: 0,
        videoWidth: 0,
        videoHeight: 0
      });

      const videoElement = document.createElement('video');
      videoElement.style.display = 'none';
      videoElement.src = fileURL;

      videoElement.onloadedmetadata = () => {
        setVideoMeta((prev: any) => ({
          ...prev,
          duration: videoElement.duration,
          videoWidth: videoElement.videoWidth,
          videoHeight: videoElement.videoHeight
        }));
      };

      videoElement.oncanplaythrough = () => {
        getThumbnails(videoElement.duration, file);
      };

      videoElement.onerror = () => {
        setError('Failed to load video. The file might be corrupt or not supported.');
      };

      document.body.appendChild(videoElement);
    } catch (error) {
      console.error('Error loading video:', error);
      setError('Failed to load video. This might be due to CORS restrictions. Try using a CORS proxy or a video URL from a server that allows cross-origin requests.');
    }
  }, [inputVideo.videoUrl]);

  useEffect(() => {
    loadFFmpeg();
    handleLoadVideo();
  }, []);

  const getThumbnails = async (duration: number, file: File) => {
    if (!FF.loaded) {
      try {
        await loadFFmpeg();
      } catch (error) {
        console.error('Error loading FFmpeg:', error);
        setError('Failed to load FFmpeg. Please check your internet connection and try again.');
        return;
      }
    }
    setThumbnailIsProcessing(true);

    let NUMBER_OF_IMAGES = Math.min(Math.floor(duration / 2), 15);
    let offset = 2;

    const generateThumbnail = async (i: number) => {
      let startTimeInSecs = helpers.toTimeString(i * offset);
      const outputFileName = `img${i}.png`;

      await FF.exec([
        "-ss", startTimeInSecs,
        "-i", 'input.mp4',
        "-t", "00:00:1.000",
        "-vf", `setpts=PTS/5,scale=150:-1`,
        outputFileName
      ]);
      const data: any = await FF.readFile(outputFileName);

      let blob = new Blob([data.buffer], { type: "image/png" });
      let dataURI = await helpers.readFileAsBase64(blob);
      return dataURI;
    };

    try {
      await FF.writeFile('input.mp4', await fetchFile(file));

      for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
        const thumbnail = await generateThumbnail(i);
        setThumbNails((prev: any) => [...prev, thumbnail]);
      }
    } catch (error) {
      console.error('Error generating thumbnails:', error);
      setError('Failed to generate thumbnails. The video might be in an unsupported format.');
    } finally {
      setThumbnailIsProcessing(false);
    }
  };

  const handleTrim = async () => {
    if (!videoMeta) {
      setError('Please load a video before trimming.');
      return;
    }
    setTrimIsProcessing(true);
    setError(null);

    let startTime: any = ((rStart / 100) * videoMeta.duration).toFixed(2);
    let offset = ((rEnd / 100) * videoMeta.duration - startTime).toFixed(2);

    try {
      await FF.exec([
        "-ss", helpers.toTimeString(startTime),
        "-i", 'input.mp4',
        "-t", helpers.toTimeString(offset),
        "-c", "copy",
        "output.mp4"
      ]);

      const data: any = await FF.readFile("output.mp4");
      const dataURL: any = await helpers.readFileAsBase64(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      setTrimmedVideoFile(dataURL);
      originalVideoData.current = dataURL;//setting this for aspect ration operation
    } catch (error) {
      console.error('Error trimming video:', error);
      setError('Failed to trim the video. Please try again or use a different video file.');
    } finally {
      setTrimIsProcessing(false);
    }
  };

  type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '9:16-P';
  const handleResize = useCallback(async (aspectRatio: AspectRatio, files: string) => {
    if (!FF) {
      alert('Please wait for FFmpeg to load.');
      return;
    }


    try {
      setAspectLoading(true);
      console.log('resize start-----');

      if (files) {

        // Convert base64 to Blob
        // const byteCharacters = atob(originalVideoData.current.split(',')[1]);
        // const byteNumbers = new Array(byteCharacters.length);
        // for (let i = 0; i < byteCharacters.length; i++) {
        //   byteNumbers[i] = byteCharacters.charCodeAt(i);
        // }
        // const byteArray = new Uint8Array(byteNumbers);
        // const blob = new Blob([byteArray], { type: 'video/mp4' });

        // const file = new File([blob], "input.mp4", { type: "video/mp4" });

        await FF.writeFile('input.mp4', await fetchFile(originalVideoData.current));
      }

      let cropFilter: string;
      switch (aspectRatio) {
        case '1:1':
          cropFilter = 'crop=min(iw,ih):min(iw,ih)';
          break;
        case '16:9':
          cropFilter = 'crop=iw:iw*9/16';
          break;
        case '9:16':
          cropFilter = 'crop=ih*9/16:ih';
          break;
        case '4:3':
          cropFilter = 'crop=ih*4/3:ih';
          break;
        case '9:16-P':
          cropFilter = 'scale=1280:2275:force_original_aspect_ratio=decrease,pad=1280:2275:(ow-iw)/2:(oh-ih)/2';
          break;
        default:
          throw new Error('Unsupported aspect ratio');
      }

      await FF.exec([
        '-i', 'input.mp4',
        '-vf', cropFilter,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '23',
        '-threads', '0',
        '-c:a', 'copy',
        'output.mp4'
      ]);

      const data: any = await FF.readFile('output.mp4');

      const dataURL: any = await helpers.readFileAsBase64(
        new Blob([data.buffer], { type: "video/mp4" })
      );

      setTrimmedVideoFile(dataURL);
      setAspectLoading(false);
      console.log('resize end-----');
    } catch (error) {
      console.error('Error processing video:', error);
      alert('An error occurred while processing the video.');
      setAspectLoading(false);
    }
  }, [setTrimmedVideoFile]);
  // const handleResize = useCallback(async (aspectRatio: string, files: any) => {
  //   if (!FF) {
  //     alert('Please select a video file first and wait for FFmpeg to load.');
  //     return;
  //   }

  //   try {
  //     setAspectLoading(true)
  //     console.log('resize start-----');

  //     const blob = await files.blob();
  //     const file = new File([blob], "input.mp4", { type: "video/mp4" });

  //     await FF.writeFile('input.mp4', await fetchFile(file));


  //     let cropFilter: string;
  //     switch (aspectRatio) {
  //       case '1:1':
  //         cropFilter = 'crop=min(iw,ih):min(iw,ih)';
  //         break;
  //       case '16:9':
  //         cropFilter = 'crop=iw:iw*9/16';
  //         break;
  //       case '9:16':
  //         cropFilter = 'crop=ih*9/16:ih';
  //         break;
  //       case '4:3':
  //         cropFilter = 'crop=ih*4/3:ih';
  //         break;
  //       case '9:16-P':
  //         cropFilter = 'scale=1280:2275:force_original_aspect_ratio=decrease,pad=1280:2275:(ow-iw)/2:(oh-ih)/2';
  //         // cropFilter = 'scale=640:480:force_original_aspect_ratio=decrease,pad=1280:2275:(ow-iw)/2:(oh-ih)/2';
  //         break;
  //       default:
  //         throw new Error('Unsupported aspect ratio');
  //     }

  //     // Use hardware acceleration (if available), multi-threading, and a faster preset
  //     await FF.exec([
  //       '-i', 'input.mp4',
  //       '-vf', cropFilter,
  //       '-c:v', 'libx264',  // Use H.264 codec
  //       '-preset', 'veryfast',  // Use a faster preset
  //       '-crf', '23',  // Adjust CRF for balance between quality and speed
  //       '-threads', '0',  // Use all available CPU cores
  //       '-c:a', 'copy',  // Copy audio without re-encoding
  //       'output.mp4'
  //     ]);

  //     const data: any = await FF.readFile('output.mp4');

  //     const dataURL: any = await helpers.readFileAsBase64(
  //       new Blob([data.buffer], { type: "video/mp4" })
  //     );

  //     setTrimmedVideoFile(dataURL);
  //     setAspectLoading(false)
  //     console.log('resize end-----');
  //   } catch (error) {
  //     console.error('Error processing video:', error);
  //     alert('An error occurred while processing the video.');
  //   }
  // }, [setTrimmedVideoFile]);

  return {
    trimmedVideoFile,
    setTrimmedVideoFile,
    videoMeta,
    trimIsProcessing,
    rStart,
    rEnd,
    thumbNails,
    thumbnailIsProcessing,
    error,
    setRstart,
    setRend,
    handleTrim,
    handleResize,
    aspectLoading
  };
};