import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SelectOption {
    value: string;
    label: string;
    style?: string;
}

interface SelectGroup {
    label: string;
    options: SelectOption[];
}

interface GenericSelectProps {
    placeholder: string;
    groups: SelectGroup[];
    width?: string;
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    resetKey?: number;
}
interface AspectRatioBoxProps {
    style?: string;
}
export default function TodaiSelect({ placeholder, groups, width = "150px", onChange, value, resetKey = 0 }: GenericSelectProps) {
    return (
        <Select key={resetKey} value={value} onValueChange={onChange}>
            <SelectTrigger className={`w-[${width}] rounded-md py-2 border-brand-primary px-5 bg-transparent`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {groups.map((group, groupIndex) => (
                    <SelectGroup key={groupIndex}>
                        <SelectLabel>{group.label}</SelectLabel>
                        <SelectSeparator />
                        {group.options.map((option, optionIndex) => (
                            <SelectItem key={optionIndex} value={option.value}>
                                {option.style ? <div className="flex items-center justify-center">  <AspectRatioBox style={option?.style} />  {option.label}</div>//added this for aspect ratio select contain a box
                                    : option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                ))}
            </SelectContent>
        </Select>
    )
}

const AspectRatioBox: React.FC<AspectRatioBoxProps> = ({ style }: any) => (
    <div className={`${style} border-2 border-gray-400 inline-block mr-2`}></div>
);
