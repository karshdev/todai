import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type DMAlertDialogProps = {
    open?: boolean
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    title?: string
    description?: string
    buttonTitle?: string
    okCallBack?: any
}

export const TodaiAlertDialog = ({
    open,
    setOpen,
    okCallBack,
    title,
    description,
    buttonTitle,
}: DMAlertDialogProps) => {

    const conditionalProp = open !== undefined ? { open } : {}
    const handleOkClick = async () => {
        if (okCallBack) {
            await okCallBack()
        }
        //setOpen(false)
    }

    return (
        <AlertDialog {...conditionalProp}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className="whitespace-break-spaces">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleOkClick}>
                        {buttonTitle}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
