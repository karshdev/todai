'use client'
import { useState, useCallback, useEffect, useRef } from 'react';
import { State, Dimensions, TextOverImageProps } from '@/screens/quotes/types/editImageTypes';
import localImages from '@/screens/quotes/components/localImages';
// import stockImg1 from "../assets/stockImg/stockImg1.jpg";
// import stockImg2 from "@/assets/stockImg/stockImg2.jpg";
// import stockImg3 from "@/assets/stockImg/stockImg3.jpg";
// import stockImg4 from "@/assets/stockImg/stockImg4.jpg";
// import stockImg5 from "@/assets/stockImg/stockImg5.jpg";
// import stockImg6 from "@/assets/stockImg/stockImg6.jpg";
// import stockImg7 from "@/assets/stockImg/stockImg7.jpg";
// import stockImg8 from "@/assets/stockImg/stockImg8.jpg";
// import stockImg9 from "@/assets/stockImg/stockImg9.jpg";
// import stockImg10 from "@/assets/stockImg/stockImg10.jpg";
// import stockImg11 from "@/assets/stockImg/stockImg11.jpg";
// import stockImg12 from "@/assets/stockImg/stockImg12.jpg";
// import stockImg13 from "@/assets/stockImg/stockImg13.jpg";
// import stockImg14 from "@/assets/stockImg/stockImg14.jpg";
// import stockImg15 from "@/assets/stockImg/stockImg15.jpg";
// import stockImg16 from "@/assets/stockImg/stockImg16.jpg";
// import stockImg17 from "@/assets/stockImg/stockImg17.jpg";
// import stockImg18 from "@/assets/stockImg/stockImg18.jpg";
// import stockImg19 from "@/assets/stockImg/stockImg19.jpg";
// import stockImg20 from "@/assets/stockImg/stockImg20.jpg";
// import authbg from '../../public/img/authbg.jpeg';

// const localImages: any = [
//     stockImg1,
//     stockImg2,
//     stockImg3,
//     stockImg4,
//     stockImg5,
//     stockImg6,
//     stockImg7,
//     stockImg8,
//     stockImg9,
//     stockImg10,
//     stockImg11,
//     stockImg12,
//     stockImg13,
//     stockImg14,
//     stockImg15,
//     stockImg16,
//     stockImg17,
//     stockImg18,
//     stockImg19,
//     stockImg20,
// ];
export const useTextOverImage = ({
    initialText,
    initialFontSize,
    initialTextColor,
    initialBgColor,
    initialBgOpacity,
    initialCornerRadius,
}: Partial<TextOverImageProps>) => {
    const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
    const [state, setState] = useState<State>({
        textColor: initialTextColor || '#000000',
        bgColor: initialBgColor || '#ffffff',
        bgOpacity: initialBgOpacity || 0.5,
        cornerRadius: initialCornerRadius || 0,
        fontSize: initialFontSize || 14,
        isSelected: false,
        imageSrc: '',
        showPicker: { textColor: false, bgColor: false },
        showOpacitySlider: false,
        showCornerRadiusSlider: false,
        showFontSizeList: false,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<any>(null);
    const trRef = useRef<any>(null);
    const bgColorPickerRef = useRef<HTMLDivElement>(null);
    const textColorPickerRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef<HTMLDivElement>(null);
    const cornerRadiusRef = useRef<HTMLDivElement>(null);
    const fontSizeInputRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<any>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const updateDimensions = useCallback(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth > 1000 ? 1000 : containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
            });
        }
    }, []);

    useEffect(() => {
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [updateDimensions]);

    useEffect(() => {
        if (state.imageSrc) {
            console.log("🚀 ~ useEffect ~ state.imageSrc:", state.imageSrc)
            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            // Check if imageSrc is a local import or a URL
            const localImage: any = getImageByName(state.imageSrc);
            if (localImage) {
                console.log('inside local import')
                img.src = localImage.src.src
            } else {
                img.src = state.imageSrc;
            }
            img.onload = () => {
                setImage(img);
            };
        }
    }, [state.imageSrc]);

    const getImageByName = (name: string) => {
        return localImages.find(image => image.name === name);
    };

    const handleSelect = useCallback(() => setState((prev) => ({ ...prev, isSelected: true })), []);

    const handleStageMouseDown = useCallback(
        (e: any) => {
            const clickedOnStage = e.target === e.target?.getStage();
            const clickedOnTransformer = e.target?.getParent()?.className === 'Transformer';
            const clickedOnGroup = e.target === groupRef?.current || groupRef.current?.findOne((node: any) => node === e.target);

            if (clickedOnStage) {
                setState((prev) => ({ ...prev, isSelected: false }));
            } else if (clickedOnTransformer) {
                return;
            } else if (clickedOnGroup) {
                handleSelect();
            } else {
                setState((prev) => ({ ...prev, isSelected: false }));
            }
        },
        [handleSelect]
    );

    const handleClickOutside = useCallback((event: MouseEvent) => {
        const refs = [bgColorPickerRef, textColorPickerRef, opacityRef, cornerRadiusRef, fontSizeInputRef];
        const keys = ['bgColor', 'textColor', 'showOpacitySlider', 'showCornerRadiusSlider', 'showFontSizeList'];

        refs.forEach((ref, index) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                if (index < 2) {
                    setState((prev) => ({
                        ...prev,
                        showPicker: { ...prev.showPicker, [keys[index]]: false },
                    }));
                } else {
                    setState((prev) => ({ ...prev, [keys[index]]: false }));
                }
            }
        });
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    return {
        state,
        setState,
        dimensions,
        containerRef,
        groupRef,
        trRef,
        bgColorPickerRef,
        textColorPickerRef,
        opacityRef,
        cornerRadiusRef,
        fontSizeInputRef,
        stageRef,
        image,
        handleStageMouseDown,
        handleSelect,
        setImage
    };
};