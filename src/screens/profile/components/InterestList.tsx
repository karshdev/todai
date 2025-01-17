import { getInterestOfUser } from '@/lib/axios/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Interests from './Interests'
import { useModal } from '@/hooks/useModal'
import { IconEdit, IconPencilPause, IconPencilPlus, IconPlus, IconTextPlus } from '@tabler/icons-react'

function InterestList() {
    const { openModal } = useModal()
    const { data, isError, isLoading } = useQuery({
        queryKey: ['userInterest'],
        queryFn: getInterestOfUser,
        select: (data: any) => data.data.data
    })
    return (
        <div className="container grid grid-cols-1 gap-6 bg-white w-full border-t pt-5">
            <div className='grid grid-cols-2 md:grid-cols-4  gap-5'>
                <h3 className='text-base font-semibold'>Interests</h3>
                <div className='flex gap-3 col-span-3 flex-wrap items-center'>
                    {data?.interests?.map((interest: any) => (
                        <span key={interest.id} className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">{interest.name}</span>))}
                </div>
            </div>
            <div className='grid  grid-cols-2 md:grid-cols-4  gap-5'>
                <h3 className='text-base font-semibold'>Tone of voice</h3>
                <div className='flex gap-3 flex-wrap col-span-3 items-center'>
                    <span className="text-sm">{data?.tone_of_voice}</span>
                </div>
            </div>
            <div className='grid  grid-cols-2 md:grid-cols-4  gap-5'>
                <h3 className='text-base font-semibold'>Instructions</h3>
                <div className='flex gap-3 flex-wrap col-span-3 items-center'>
                    <span className="text-sm">{data?.instructions}</span>
                </div>
            </div>
            <div className=''>
                <label className="flex items-center gap-1 text-sm font-medium text-brand-primary cursor-pointer mb-1 w-fit" onClick={() => openModal('interests')}><IconPencilPlus />Add/Edit Tone</label>
            </div>

            <Interests data={data} />
        </div>
    )
}

export default InterestList