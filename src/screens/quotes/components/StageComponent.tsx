import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Group,
  Image,
  Layer,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";
import { Dimensions, State } from "../types/editImageTypes";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";

interface StageComponentProps {
  dimensions: Dimensions;
  state: State;
  image: HTMLImageElement | null;
  selectedQuote: string;
  handleStageMouseDown: (e: any) => void;
  groupRef: React.RefObject<any>;
  trRef: React.RefObject<any>;
  stageRef: React.RefObject<any>;
  onSelect: () => void;
  textRef: any;
  selectedFont: string;
  adjustFontSize: any;
  textStyle: any;
  setState: any;
}

// interface TextStyle {
//   bold: boolean;
//   italic: boolean;
//   underline: boolean;
// }

export const StageComponent: React.FC<StageComponentProps> = ({
  dimensions,
  state,
  image,
  selectedQuote,
  handleStageMouseDown,
  groupRef,
  trRef,
  stageRef,
  onSelect,
  selectedFont,
  textRef,
  adjustFontSize,
  textStyle,
  setState,
}) => {
  // const [textStyle, setTextStyle] = useState<TextStyle>({
  //   bold: false,
  //   italic: false,
  //   underline: false,
  // });
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [state.isSelected, trRef, groupRef]);

  useClickOutside(containerRef, () => {
    // Deselect the transformer when clicking outside
    setState((prev: any) => ({
      ...prev,
      isSelected: false,
    }));
  });

  const handleTransform = () => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const rect = group.findOne("Rect");

    if (!rect) return;

    const scaleX = group.scaleX();
    const scaleY = group.scaleY();

    group.scaleX(1);
    group.scaleY(1);

    rect.width(rect.width() * scaleX);
    rect.height(rect.height() * scaleY);

    const text = textRef.current;
    if (text) {
      text.width(rect.width());
      text.height(rect.height());
    }

    adjustFontSize();
  };

  // const toggleStyle = (style: keyof TextStyle) => {
  //   setTextStyle((prev) => ({
  //     ...prev,
  //     [style]: !prev[style],
  //   }));
  // };

  // Function to compute font style string
  const getFontStyle = () => {
    let style = "";
    if (textStyle.bold) style += "bold ";
    if (textStyle.italic) style += "italic ";
    return style || "normal";
  };

  return (
    <div className="flex flex-col gap-4" ref={containerRef}>
      <Stage
        className="grid place-items-center"
        width={dimensions.width}
        height={dimensions.height * 0.75}
        onMouseDown={handleStageMouseDown}
        ref={stageRef}>
        <Layer>
          {image ? (
            <Image
              image={image}
              width={dimensions.width}
              height={dimensions.height * 0.75}
              alt="bg-image"
            />
          ) : (
            <Text
              text="Select Image"
              fontSize={24}
              fill="#ccc"
              width={dimensions.width}
              height={dimensions.height * 0.75}
              align="center"
              verticalAlign="middle"
              fontFamily="Roboto"
            />
          )}
          <Group
            ref={groupRef}
            draggable
            onClick={onSelect}
            onTap={onSelect}
            onTransform={handleTransform}
            onTransformEnd={handleTransform}>
            <Rect
              width={textRef.current?.width() || 300}
              height={textRef.current?.height() || 200}
              fill={state.bgColor}
              opacity={state.bgOpacity}
              cornerRadius={state.cornerRadius}
            />
            <Text
              ref={textRef}
              text={selectedQuote}
              fontSize={state.fontSize}
              fill={state.textColor}
              width={300}
              height={200}
              align="center"
              verticalAlign="middle"
              fontFamily={selectedFont}
              fontStyle={getFontStyle()}
              textDecoration={textStyle.underline ? "underline" : ""}
              autoSize={true}
            />
          </Group>
          {state.isSelected && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
