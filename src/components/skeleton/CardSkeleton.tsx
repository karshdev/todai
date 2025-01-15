import React from 'react'
import { Skeleton } from '../ui/skeleton'

function CardSkeleton() {
    return <>
        {Array.from({ length: 10 }, (_, index) => <div key={index} className="flex flex-col space-y-3 my-5 w-full">
            <Skeleton className="h-[125px] w-[90%] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[90%] " />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[50%]" />
                <div className='flex justify-between w-[90%]'>
                    <Skeleton className='h-8 w-14 rounded-3xl' />
                    <Skeleton className='h-8 w-14 rounded-3xl' />
                </div>
            </div>
        </div>)}</>;
}

export default CardSkeleton