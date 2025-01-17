import loadingIcon from '@/assets/img/loading-circle.svg'
import { TodaiImage } from './TodaiImage'

type ButtonProps = {
    children: React.ReactNode
    className?: string
    variant?: 'primary' | 'primary-outline' | 'secondary' | 'bgthird' | 'text'
    type?: 'button' | 'submit'
    onClick?: (event?: React.MouseEvent<HTMLElement>) => void
    disabled?: boolean
    formAction?: ((formData: FormData) => void) | (() => void)
    loading?: boolean
}

export const defaultButtonStyles = 'px-[35px] py-[8px]'
export const allVariants = {
    primary:
        'text-brand-secondary bg-brand-primary font-semibold rounded-full hover:bg-brand-primary-hover',
    'primary-outline':
        'text-brand-primary border border-brand-primary font-semibold rounded-full hover:bg-brand-primary-hover',
    secondary: 'text-primary bg-brand-secondary',
    bgthird: 'text-brand-secondary bg-brand-silver',
    text: 'text-primary font-normal px-0 py-0 hover:text-brand-primary',
}

export const TodaiButton = ({
    type = 'button',
    children,
    className = '',
    variant = 'text',
    onClick,
    disabled = false,
    formAction,
    loading,
}: ButtonProps) => {
    const currentVariant = `${defaultButtonStyles} ${allVariants[variant]}`

    return (
        <button
            formAction={formAction}
            type={type}
            onClick={onClick}
            className={`${currentVariant} ${className}  ${disabled && 'opacity-40 cursor-not-allowed'
                }`}
            disabled={disabled}
        >
            {loading ? (
                <TodaiImage
                    className="animate-spin h-5 w-5 text-white"
                    src={loadingIcon}
                    width={100}
                    height={100}
                    alt="loading"
                />
            ) : (
                children
            )}
        </button>
    )
}
