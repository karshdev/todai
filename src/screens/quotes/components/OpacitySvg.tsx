import React from "react";


type OpacitySvgProps = {
    className?: string;
    color?: string;
    width?: number;
    height?: number;
    alt?: string;
};
const OpacitySvg: React.FC<OpacitySvgProps> = React.memo(({ className, color = 'black', width = 48, height = 48, alt }) => {
    return (

        <div className="relative">
            <svg width={width}
                height={height}
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                aria-label={alt}>
                <linearGradient id="SVGID_Fill1_" gradientUnits="objectBoundingBox" x1="0.853553" y1="0.853553" x2="1.85355" y2="0.853553" gradientTransform="rotate(225.000000 0.853553 0.853553)">
                    <stop offset="0" stop-color="#000000" stop-opacity="0" />
                    <stop offset="1" stop-color="#000000" stop-opacity="1" />
                </linearGradient>
                <path fill="url(#SVGID_Fill1_)" stroke-width="0.2" stroke-linejoin="round" d="M 19,19L 25.3333,19L 25.3333,25.3333L 31.6667,25.3333L 31.6667,19L 38,19L 38,25.3333L 44.3333,25.3333L 44.3333,19L 50.6667,19L 50.6667,25.3333L 57,25.3333L 57,31.6667L 50.6667,31.6667L 50.6667,38L 57,38L 57,44.3333L 50.6667,44.3333L 50.6667,50.6667L 57,50.6667L 57,57L 50.6667,57L 50.6667,50.6667L 44.3333,50.6667L 44.3333,57L 38,57L 38,50.6667L 31.6667,50.6667L 31.6667,57L 25.3333,57L 25.3333,50.6667L 19,50.6667L 19,44.3333L 25.3333,44.3333L 25.3333,38L 19,38L 19,31.6667L 25.3333,31.6667L 25.3333,25.3333L 19,25.3333L 19,19 Z M 50.6667,38L 44.3333,38L 44.3333,44.3333L 50.6667,44.3333L 50.6667,38 Z M 50.6667,25.3333L 44.3333,25.3333L 44.3333,31.6667L 50.6667,31.6667L 50.6667,25.3333 Z M 44.3333,44.3333L 38,44.3333L 38,50.6667L 44.3333,50.6667L 44.3333,44.3333 Z M 38,44.3333L 38,38L 31.6667,38L 31.6667,44.3333L 38,44.3333 Z M 31.6667,44.3333L 25.3333,44.3333L 25.3333,50.6667L 31.6667,50.6667L 31.6667,44.3333 Z M 44.3333,31.6667L 38,31.6667L 38,38L 44.3333,38L 44.3333,31.6667 Z M 38,31.6667L 38,25.3333L 31.6667,25.3333L 31.6666,31.6667L 38,31.6667 Z M 31.6666,31.6667L 25.3333,31.6667L 25.3333,38L 31.6667,38L 31.6666,31.6667 Z " />
            </svg>
            <p className="absolute top-1/2 left-1/2 text-[10px] text-white bg-black bg-opacity-40 px-0.5">88.50</p>
        </div>
    )
})

OpacitySvg.displayName = 'OpacitySvg'

export default OpacitySvg