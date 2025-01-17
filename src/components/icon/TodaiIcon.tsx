import React, { JSXElementConstructor } from 'react';
import { IconProps } from '@tabler/icons-react';

interface TodaiIconProps {
  children: React.ReactElement<any, string | JSXElementConstructor<any>>;
  height?: string | number;
  width?: string | number;
  color?: string;
}

const TodaiIcon: React.FC<TodaiIconProps> = ({
  children,
  height = '24px',
  width = '24px',
  color = 'text-slate-400'
}) => {
  return (
    <div className={`text-gray-400 ${color}`} style={{ height, width }}>
      {React.cloneElement(children, { size: height })}
    </div>
  );
}

export default TodaiIcon;
