'use client'
import * as Tooltip from '@radix-ui/react-tooltip'
import React from 'react'

type TodaiTooltipProps = {
   id?: string
   open?: boolean
   triggerContent: React.ReactNode
   tooltipContent: React.ReactNode
   delayDuration?: number
   dataSide?: 'top' | 'right' | 'bottom' | 'left'
}

function TodaiTooltip({
   id,
   open,
   triggerContent,
   tooltipContent,
   delayDuration = 1000,
   dataSide = 'top'
}: TodaiTooltipProps) {
   const conditionalProp = open !== undefined ? { open } : {}

   return (
      <Tooltip.Provider delayDuration={delayDuration}>
         <Tooltip.Root {...conditionalProp}>
            <Tooltip.Trigger asChild id={id}>
               {triggerContent}
            </Tooltip.Trigger>

            {tooltipContent && (
               <Tooltip.Portal>
                  <Tooltip.Content
                     className={
                        'z-[100] max-w-[400px] bg-slate-900 !text-white font-semibold text-xs data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]'
                     }
                     sideOffset={5}
                     side={dataSide}
                  >
                     {tooltipContent}
                     <Tooltip.Arrow className="fill-slate-900" />
                  </Tooltip.Content>
               </Tooltip.Portal>
            )}
         </Tooltip.Root>
      </Tooltip.Provider>
   )
}

export default TodaiTooltip
