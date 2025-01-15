import { TodaiButton } from "@/components/TodaiButton";
import TextColorSvg from "./TextColorSvg";
import BgColorIcon from "./BgColorIcon";
import {
  HexColorInput,
  HexColorPicker,
  RgbaStringColorPicker,
} from "react-colorful";
import { cn } from "@/lib/utils";
import useClickOutside from "@/hooks/useClickOutside";
import { useCallback } from "react";
import { colord } from "colord"; // Import colord for color conversion

interface ColorPickerProps {
  label?: string;
  color: string;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  handleColorChange: (color: string) => void;
  pickerRef: React.RefObject<HTMLDivElement>;
  type?: string | "";
  pickerPosition?: "top-10" | "left-10" | "right-10" | "bottom-10" | string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  color,
  showPicker,
  setShowPicker,
  handleColorChange,
  pickerRef,
  type,
  pickerPosition,
}) => {
  const close = useCallback(() => setShowPicker(!showPicker), []);
  useClickOutside(pickerRef, close);

  // Handle hex color change and convert it to RGBA string for the color picker
  const handleHexChange = (hex: string) => {
    if (colord(hex).isValid()) {
      const rgbaString = colord(hex).toRgbString();
      handleColorChange(rgbaString);
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      <TodaiButton
        onClick={() => setShowPicker(!showPicker)}
        className="flex justify-center items-center text-gray-700 hover:text-gray-900 !px-0">
        {type == "txtColor" ? (
          <TextColorSvg className="w-7 h-7" color={color} />
        ) : (
          <BgColorIcon color={color} />
        )}
        <span className="font-medium">{label}</span>
      </TodaiButton>
      {showPicker && (
        <div
          ref={pickerRef}
          className={cn(
            "absolute xl:bottom-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-fit h-fit z-10",
            pickerPosition
          )}>
          <RgbaStringColorPicker color={color} onChange={handleColorChange} />
          <HexColorInput
            placeholder="Enter hex color"
            className="p-1 rounded-md border w-full text-sm mt-2"
            color={colord(color).toHex()} // Display color as hex in the input
            onChange={handleHexChange} // Convert hex to RGBA on change
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
