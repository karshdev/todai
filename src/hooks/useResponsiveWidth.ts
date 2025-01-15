import { useState, useEffect } from 'react';

type WidthConfig = {
  [key: string]: {
    minWidth: number;
    width: string;
  };
};

const defaultConfig: WidthConfig = {
  xs: { minWidth: 0, width: '300px' },
  sm: { minWidth: 640, width: '350px' },
  md: { minWidth: 768, width: '400px' },
  lg: { minWidth: 1024, width: '400px' },
};

export const useResponsiveWidth = (customConfig?: WidthConfig) => {
  const config = customConfig || defaultConfig;
  const [width, setWidth] = useState('300px');

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const sizes = Object.keys(config).reverse();
      
      for (const size of sizes) {
        if (windowWidth >= config[size].minWidth) {
          setWidth(config[size].width);
          break;
        }
      }
    };

    handleResize(); // Set initial width
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [config]);

  return width;
};