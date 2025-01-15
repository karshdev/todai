'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { allVariants, defaultButtonStyles } from '../TodaiButton'

type LinkProps = {
    children: React.ReactNode
    className?: string
    variant?: 'primary' | 'secondary' | 'primary-outline' | 'bgthird' | 'text'
    href: string
}

export const TodaiLink = ({
    children,
    className = '',
    variant = 'text',
    href = '/',
}: LinkProps) => {
    // const { locale } = useParams()
    const currentVariant = `${defaultButtonStyles} ${allVariants[variant]}`

    return (
        <Link
            href={`/${href}`}
            className={cn(currentVariant, className)}
        >
            {children}
        </Link>
    )
}
