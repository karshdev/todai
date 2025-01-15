import { IconCheck } from "@tabler/icons-react";
import { Check } from "lucide-react";
import React from "react";

interface TodaiColorPaletteProps {
  colors: string[];
  isSelected: boolean;
  onClick: () => void;
}

const TodaiColorPalette: React.FC<TodaiColorPaletteProps> = ({
  colors,
  isSelected,
  onClick,
}) => (
  <div onClick={onClick} className={`flex cursor-pointer rounded-md relative`}>
    {colors.map((color, index) => (
      <div key={index} style={{ backgroundColor: color }} className="w-5 h-5" />
    ))}
    {isSelected && (
      <span className="absolute top-1/2  right-1/2 transform -translate-y-1/2 translate-x-1/2">
        <IconCheck className="w-4 h-4 text-white" />
      </span>
    )}
  </div>
);

export default TodaiColorPalette;
