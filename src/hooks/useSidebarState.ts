import { useState, useCallback } from 'react';

export const useSidebarState = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    return {
        isCollapsed,
        toggleSidebar
    };
};