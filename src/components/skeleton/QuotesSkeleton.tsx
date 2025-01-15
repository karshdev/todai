import React from 'react'
import { Skeleton } from '../ui/skeleton';
import { TodaiImage } from '../TodaiImage';
import quotation from '@/assets/img/quotation.svg'


function QuotesSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {Array.from({ length: 16 }, (_, index) => <div key={index} className="relative flex flex-col space-y-3 my-5 w-full overflow-clip">
                <TodaiImage className='absolute top-6 left-2 opacity-5 h-10 w-10' src={quotation} alt='quotation img' width={100} height={100} />
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <TodaiImage className='absolute -bottom-6 -right-5 opacity-5 h-32 w-32 rotate-180 ' src={quotation} alt='quotation img' width={100} height={100} />
            </div>)}
        </div>
    )


}

export default QuotesSkeleton