import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

type SheetProps = {
    openSheet: boolean;
    title?: string;
    sheetContent?: React.ReactNode;
    onClose: () => void;
}
function TodaiSheet({ openSheet, title, sheetContent, onClose }: SheetProps) {
    return (
        <Sheet open={openSheet} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-[90vw] md:w-[85vw] 2xl:w-2/3 !max-w-[1500px] p-0 pt-6 md:p-6  overflow-y-auto overflow-x-hidden">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription className="p-0">
                        {sheetContent || "This action cannot be undone. This will permanently delete your account and remove your data from our servers."}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>


    )
}

export default TodaiSheet