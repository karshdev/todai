import React from "react";
import * as helpers from "@/lib/helper";
import { Loader } from "lucide-react";
import { TodaiImage } from "@/components/TodaiImage";

export default function SeekBar({
    thumbNails,
    rEnd,
    rStart,
    handleUpdaterStart,
    handleUpdaterEnd,
    loading,
    control,
    videoMeta,
}: any) {
    let RANGE_MAX = 100;

    if (loading && thumbNails.length === 0) {
        return (
            <center className="mt-5 h-5 w-full animate-pulse bg-gray-400">
                <h2 className="text-center text-black text-sm">
                    Thumbnail is loading
                </h2>
            </center>
        );
    }

    if (!thumbNails.length && !loading) {
        return (
            <center>
                <h2 className="text-center text-white text-lg">
                    Thumbnails not available...
                </h2>
            </center>
        );
    }

    return (
        <>
            <div className="range_pack relative h-24 mx-4 overflow-clip">
                {loading && <div className="absolute left-1/2 top-1/2 -mt-4 right-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-50"><Loader className="animate-spin" /></div>}
                <div className="image_box w-full my-2 self-start">
                    {thumbNails.map((imgURL: string, id: number) => (
                        <TodaiImage src={imgURL} alt={`sample_video_thumbnail_${id}`} key={id} height={100} width={100} />
                    ))}

                    {!loading && <div
                        className="clip_box bg-brand-primary-hover bg-opacity-50"
                        style={{
                            width: `calc(${rEnd - rStart}% )`,
                            left: `${rStart}%`,
                        }}
                        data-start={helpers.toTimeString(
                            (rStart / RANGE_MAX) * videoMeta.duration,
                            false
                        )}
                        data-end={helpers.toTimeString(
                            (rEnd / RANGE_MAX) * videoMeta.duration,
                            false
                        )}
                    >
                        <span className="clip_box_des"></span>
                        <span className="clip_box_des"></span>
                    </div>}

                    {!loading && <input
                        className="range"
                        type="range"
                        min={0}
                        max={RANGE_MAX}
                        onInput={handleUpdaterStart}
                        value={rStart}
                    />}
                    {!loading && <input
                        className="range"
                        type="range"
                        min={0}
                        max={RANGE_MAX}
                        onInput={handleUpdaterEnd}
                        value={rEnd}
                    />}
                </div>
            </div>

            {control}
        </>
    );
}