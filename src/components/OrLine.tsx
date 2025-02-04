import React from 'react'


type Props = { text: string }
function OrLine({ text }: Props) {
    return (
        <div className="w-full">
            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-xs">{text}</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
        </div>
    )
}

export default OrLine