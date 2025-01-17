import React from 'react';

type BgColorIconProps = {
    className?: string;
    color?: string;
};

const BgColorIcon: React.FC<BgColorIconProps> = React.memo(({ className, color }) => {
    return (
        <div className={`h-7 w-7 rounded-md border ${className}`} style={{ backgroundColor: color }}></div>
    );
});
BgColorIcon.displayName = 'BgColorIcon';
export default BgColorIcon;
