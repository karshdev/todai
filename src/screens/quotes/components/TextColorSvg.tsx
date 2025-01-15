import React from 'react'

type TextColorSvgProps = {
    className?: string;
    color?: string;
    width?: number;
    height?: number;
    alt?: string;
};
const TextColorSvg: React.FC<TextColorSvgProps> = React.memo(({ className, color = 'black', width = 48, height = 48, alt }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label={alt}
        >
            <title>{alt}</title>
            <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                    <rect width="38" height="38" fill={color == '#ffffff' ? 'black' : 'white'} />
                </g>
                <g id="Q3_icons" data-name="Q3 icons">
                    <path d="M43,3H5A2,2,0,0,0,3,5V43a2,2,0,0,0,2,2H43a2,2,0,0,0,2-2V5A2,2,0,0,0,43,3ZM33.4,37l-2.6-6H17.2l-2.6,6H10.2L21.5,11h5L37.8,37ZM18.9,27H29.1L24,14.9Z" fill={color} />
                </g>
            </g>
        </svg>
    )
})

TextColorSvg.displayName = 'TextColorSvg'

export default TextColorSvg