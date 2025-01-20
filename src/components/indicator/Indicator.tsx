import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlagiarismCheck } from '@/hooks/usePlagiarismCheck';


type IndicatorProps = {
  content: string;
  previousContent: string;
};


const getPlagiarismStatus = (score: number | undefined) => {
  if (score === undefined) return { color: 'bg-gray-200', message: 'Checking content...' };
  
  if (score >= 60) {
    return { color: 'bg-green-500', message: 'Original content' };
  } else if (score >= 30) {
    return { color: 'bg-yellow-500', message: 'Partially unique content' };
  } else {
    return { color: 'bg-red-500', message: 'High similarity detected' };
  }
};

const Indicator: React.FC<IndicatorProps> = ({ content, previousContent }) => {
  const { score, isLoading, isError } = usePlagiarismCheck(previousContent,content);
  const { color, message } = getPlagiarismStatus(score);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative flex items-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
              </div>
            )}
            <div 
              className={`w-4 h-4 rounded-full ${isError ? 'bg-gray-400' : color}`}
              aria-label="plagiarism indicator"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isError ? 'Error checking content' : message}
          {score !== undefined && ` (Score: ${score})`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Indicator;