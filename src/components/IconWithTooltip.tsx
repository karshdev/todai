import React from 'react';
import TodaiTooltip from './tooltip';


type IconWithTooltipProps = {
    Icon: React.ElementType;
    onClick?: () => void;
    tooltipText: string;
    className?: string;
}


const IconWithTooltip = ({ Icon, onClick, tooltipText, className }: IconWithTooltipProps) => {
    return (
        <TodaiTooltip
            triggerContent={<Icon className={className} onClick={onClick} />}
            tooltipContent={<p className='text-xs'>{tooltipText}</p>}
        />
    );
};

export default IconWithTooltip;
