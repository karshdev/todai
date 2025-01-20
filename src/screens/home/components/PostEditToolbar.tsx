import IconWithTooltip from '@/components/IconWithTooltip';
import TodaiTooltip from '@/components/tooltip';
import { useResponsiveWidth } from '@/hooks/useResponsiveWidth';
import { IconPencilBolt, IconPhotoAi } from '@tabler/icons-react';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import { Hash, Paperclip, SmilePlusIcon, Images  } from 'lucide-react';
import React from 'react';

type PostEditToolbarProps = {
  onGenerateImage: () => void;
  onGenerateHashtags: () => void;
  onEmojiSelect: (emojiObject: { emoji: string }) => void;
  onGifSelect: (gif: { url: string }) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isPickerOpen: boolean;
  pickerType: 'gif' | 'emoji' | null;
  tenorApiKey: string;
  handlePickerToggle: any,
  pickerRef: any,
  fileInputRef: any,
  handleAiRewriteClick?: () => void
  toggleStockImage?: () => void
};

const extraClass = 'w-5 h-5 cursor-pointer text-slate-400 hover:bg-slate-100 rounded-md'

const PostEditToolbar: React.FC<PostEditToolbarProps> = ({
  onGenerateImage,
  onGenerateHashtags,
  onEmojiSelect,
  onGifSelect,
  onImageUpload,
  isPickerOpen,
  pickerType,
  tenorApiKey,
  handlePickerToggle,
  pickerRef,
  fileInputRef,
  handleAiRewriteClick,
  toggleStockImage
}) => {
  const width = useResponsiveWidth();

  return (
    <div className='relative flex space-x-2 items-center'>
      <IconWithTooltip Icon={IconPencilBolt} className={extraClass} tooltipText='Rewrite with AI' onClick={handleAiRewriteClick} />
      <IconWithTooltip Icon={IconPhotoAi} className={extraClass} onClick={onGenerateImage} tooltipText='Generate AI Image' />
      <IconWithTooltip Icon={Paperclip} className={extraClass} onClick={() => fileInputRef.current?.click()} tooltipText='Attach Image' />
      <IconWithTooltip Icon={Images} className={extraClass} onClick={toggleStockImage} tooltipText='Stock Image' />
      <IconWithTooltip Icon={Hash} className={extraClass} onClick={onGenerateHashtags} tooltipText='Generate Hashtags' />
      <TodaiTooltip
        triggerContent={
          <p
            onClick={() => handlePickerToggle('gif')}
            className="flex items-center text-xs font-semibold w-5 h-5 cursor-pointer text-slate-400 hover:bg-slate-100 rounded-md"
          >
            GIF
          </p>
        }
        tooltipContent={<p className='text-xs'>Select GIF</p>}
      />
      <IconWithTooltip Icon={SmilePlusIcon} className={extraClass} onClick={() => handlePickerToggle('emoji')} tooltipText='Add emojis' />
      <div ref={pickerRef}>
        {isPickerOpen && pickerType === 'emoji' && (
          <div className={`absolute top-full left-0 md:-left-6 mt-1 shadow-lg rounded-lg z-10`}>
            <EmojiPicker height={400} width={width} onEmojiClick={onEmojiSelect} autoFocusSearch />
          </div>
        )}
        {isPickerOpen && pickerType === 'gif' && (
          <div className="absolute top-full left-0 md:-left-6 mt-1 shadow-lg rounded-lg mr-10 z-10">
            <GifPicker
              height={400}
              width={width}
              tenorApiKey={tenorApiKey}
              onGifClick={onGifSelect}
            />
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        ref={fileInputRef}
        className="hidden"
      />
    </div >
  );
};

export default PostEditToolbar;


