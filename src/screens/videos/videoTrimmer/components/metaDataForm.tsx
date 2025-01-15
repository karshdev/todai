import React from 'react';
import TodaiInput from '@/components/TodaiInput';

interface MetaDataFormProps {
  videoMetaData: {
    title: string;
    description: string;
    tags: string;
  };
  handleVideoMetaDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const MetaDataForm: React.FC<MetaDataFormProps> = React.memo(({ videoMetaData, handleVideoMetaDataChange }) => {
  return (
    <div className='w-full space-y-4'>
      <div className='w-full'>
        <h2 className="text-sm font-bold text-gray-800">Title</h2>
        <TodaiInput
          name='title'
          value={videoMetaData.title}
          onChange={handleVideoMetaDataChange}
          className="border p-2 rounded w-full mb-2"
          placeholder="Enter text"
        />
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-800">Description</h2>
        <textarea
          rows={5}
          name='description'
          value={videoMetaData.description}
          onChange={handleVideoMetaDataChange}
          className="border p-2 rounded w-full mb-2"
          placeholder="Enter text"
        />
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-800">Tags</h2>
        <textarea
          rows={3}
          name='tags'
          value={videoMetaData.tags}
          onChange={handleVideoMetaDataChange}
          className="border p-2 rounded w-full mb-2"
          placeholder="Enter text"
        />
      </div>
    </div>
  );
});

MetaDataForm.displayName = 'MetaDataForm'
