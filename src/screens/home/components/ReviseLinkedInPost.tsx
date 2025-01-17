import { TodaiButton } from "@/components/TodaiButton"
import TodaiInput from "@/components/TodaiInput"
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton"
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader"
import TodaiTooltip from "@/components/tooltip"
import { IconCheck, IconReload } from "@tabler/icons-react"

type propReviseLinkedInPost = {
    pending?: boolean,
    content: string
    aiRewrite: any
    mutate?: any,
    setPostText?: (content: string) => void
    setAiRewrite: any
}
export const ReviseLinkedInPost = ({ pending, aiRewrite, content, mutate, setPostText, setAiRewrite }: propReviseLinkedInPost) => {

    const handleRegenerateClick = () => {
        mutate(content)
    }
    const handleDoneClick = () => {
        setPostText && setPostText(aiRewrite.content)
        handleCloseClick()
    }

    const handleCloseClick = () => {
        setAiRewrite({ show: false, content: '' })
    }

    return (
        <div className='p-5'>
            <TodaiTooltip triggerContent={<IconReload className='absolute -top-[23.5px] right-8 w-4 h-4 cursor-pointer hover:text-slate-600' onClick={handleRegenerateClick} />} tooltipContent='Regenerate' />
            {/* <div className='flex items-center gap-2'>
                <TodaiAvatar authorImage={dummyAuthor} extraClass={'w-7 h-7'} />
                <p className='font-semibold text-slate-600'>Revise this linkedIn post:</p>
            </div> */}
            <div className=' space-y-4'>
                {/* <p >{content}</p> */}
                {!pending && <TodaiInput type='textarea' rows={20} autoFocus inputClass='border' value={aiRewrite.content} onChange={(e: any) => setAiRewrite((prev: any) => ({ ...prev, content: e.target.value }))} />}
                {pending && <TodaiCircularLoader height='h-[550px]' />}
            </div>
            {<div className='mt-2 flex gap-2 justify-end'>
                <TodaiButton variant='primary-outline' className='bg-transparent border-slate-200 hover:bg-slate-200 !text-brand-primary' onClick={handleCloseClick}>Cancel</TodaiButton>
                <TodaiAnimatedButton disabled={pending} onClick={handleDoneClick} variant='primary' className='bg-brand-primary rounded-md text-white w-32 '>
                    <div className='flex gap-0.5 items-center'>
                        <IconCheck className='text-slate-300' />
                        <p>Confirm</p>
                    </div>
                </TodaiAnimatedButton>
            </div>}
        </div>
    )
}