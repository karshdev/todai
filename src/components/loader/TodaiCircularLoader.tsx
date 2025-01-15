import React from 'react'

type LoaderProps = {
    height?: string,
}
function TodaiCircularLoader({ height }: LoaderProps) {
    return (
        <div className={`flex flex-col items-center justify-center bg-transparent  w-full ${height ? height : 'min-h-[500px]'}`}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        </div>
    )
}

export default TodaiCircularLoader