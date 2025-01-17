import React, { useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';

type TodaiDialogProps = {
   triggerContent?: React.ReactNode;
   content: React.ReactNode;
   footerContent?: React.ReactNode;
   dialogTitle?: string;
   dialogWidth?: string;
   open?: boolean;
   setOpen?: (open: any) => void;
   extraClass?: string
};

function TodaiDialog({ triggerContent, content, dialogTitle, dialogWidth, open, setOpen, extraClass, footerContent }: TodaiDialogProps) {
   const [internalOpen, setInternalOpen] = useState(false);
   const isControlled = open !== undefined && setOpen !== undefined;

   const handleOpenChange = (state: boolean) => {
      if (isControlled) {
         setOpen(state);
      } else {
         setInternalOpen(state);
      }
   };

   return (
      <Dialog open={isControlled ? open : internalOpen} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
            <button onClick={() => handleOpenChange(true)}>
               {triggerContent}
            </button>
         </DialogTrigger>
         <DialogContent
            className={`h-auto w-auto bg-white dark:bg-brand-secondary border-none !p-0 rounded-md overflow-clip ${extraClass} ${dialogWidth ? dialogWidth : 'w-[90%] lg:!w-full'
               }`} onClick={(e) => e.stopPropagation()}
         >
            <DialogHeader>
               {dialogTitle && <DialogTitle>{dialogTitle}</DialogTitle>}
               <DialogDescription className="h-full w-full relative max-h-[80vh]">
                  {content}
               </DialogDescription>
            </DialogHeader>
            <DialogFooter className='flex items-center justify-center '>{footerContent}</DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

export default TodaiDialog;
