'use client'
import TodaiInput from "@/components/TodaiInput";

interface FontSizeSelectorProps {
    fontSize: number;
    handleFontSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showFontSizeList: boolean;
    setShowFontSizeList: (show: boolean) => void;
    predefinedFontSizes: number[];
    fontSizeInputRef: React.RefObject<HTMLDivElement>;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({
    fontSize,
    handleFontSizeChange,
    showFontSizeList,
    setShowFontSizeList,
    predefinedFontSizes,
    fontSizeInputRef,
}) => (
    <div className="relative">
        <div className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            {/* <TextColorSvg className="w-6 h-6" /> */}
            <TodaiInput
                type="number"
                value={fontSize}
                onChange={handleFontSizeChange}
                step={0.5}
                min={0}
                inputClass="font-medium !text-xs !w-16 border border-gray-300 rounded-md "
                onClick={() => setShowFontSizeList(!showFontSizeList)}
            />
        </div>
        {showFontSizeList && (
            <div
                ref={fontSizeInputRef}
                className="absolute xl:bottom-10  mt-2 w-full text-xs h-56 overflow-y-scroll bg-white border border-gray-300 rounded-lg shadow-lg p-1 z-10"
            >
                {predefinedFontSizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => handleFontSizeChange({ target: { value: size.toString() } } as React.ChangeEvent<HTMLInputElement>)}
                        className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100"
                    >
                        {size}px
                    </button>
                ))}
            </div>
        )}
    </div>
);

export default FontSizeSelector