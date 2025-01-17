
export type TextOverImageProps = {
    initialText?: string;
    initialFontSize?: number;
    initialTextColor?: string;
    initialBgColor?: string;
    initialBgOpacity?: number;
    initialCornerRadius?: number;
    selectedQuote: string;
    setselectedQuote: React.Dispatch<React.SetStateAction<string>>;
}

export type State = {
    textColor: string;
    bgColor: string;
    bgOpacity: number;
    cornerRadius: number;
    fontSize: number;
    isSelected: boolean;
    imageSrc: string;
    showPicker: {
        textColor: boolean;
        bgColor: boolean;
    };
    showOpacitySlider: boolean;
    showCornerRadiusSlider: boolean;
    showFontSizeList: boolean;
}

export type Dimensions = {
    width: number;
    height: number;
}