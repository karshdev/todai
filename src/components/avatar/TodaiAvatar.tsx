import React from 'react'
import { TodaiImage } from '../TodaiImage'

type PropTodaiAvatar = {
    authorImage: any,
    extraClass?: any
}

function TodaiAvatar({ authorImage, extraClass }: PropTodaiAvatar) {
    return (
        <TodaiImage src={authorImage} alt="Author" className={`w-12 h-12 object-cover rounded-full border-2 border-white ${extraClass}`} width={500} height={500} />
    )
}

export default TodaiAvatar