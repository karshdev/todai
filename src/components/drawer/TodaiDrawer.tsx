import { TodaiButton } from "@/components/TodaiButton"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

function TodaiDrawer() {
    return (
        <Drawer direction="left">
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent className="h-screen w-[50%]">
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <TodaiButton>Submit</TodaiButton>
                    <DrawerClose>
                        <TodaiButton variant="secondary">Cancel</TodaiButton>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default TodaiDrawer