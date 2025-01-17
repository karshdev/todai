'use client';
import { useEffect } from 'react';


declare global {
    interface Window {
        BrevoConversationsID?: string;
        BrevoConversations?: (...args: any[]) => void;
        [key: string]: any;  // Allow dynamic properties on window
    }
}


const BrevoWidget = () => {
  useEffect(() => {
    (function(d, w, c) {
      w.BrevoConversationsID = process.env.NEXT_PUBLIC_BRAVO_CONVERSATION_ID ?? '';
      w[c] = w[c] || function() {
        (w[c].q = w[c].q || []).push(arguments);
      };
      const s = d.createElement('script');
      s.async = true;
      s.src = process.env.NEXT_PUBLIC_BRAVO_CONVERSATION_SRC ?? '';
      if (d.head) d.head.appendChild(s);
    })(document, window, 'BrevoConversations');
  }, []);

  return null;
};

export default BrevoWidget;