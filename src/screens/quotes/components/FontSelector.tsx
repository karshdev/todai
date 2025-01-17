'use client'
import React, { useState, useEffect } from "react";
import Select from "react-select";

const FontSelector = ({ selectedFont, onFontChange }: any) => {
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const fontOptions = data.items.map((font: any) => ({
          value: font.family,
          label: font.family,
        }));
        setFonts(fontOptions);
      });
  }, []);

  const handleFontChange = (selectedOption: any) => {
    onFontChange(selectedOption.value);
  };

  return (
    <Select
      className="w-44"
      menuPlacement="auto"
      value={fonts.find((font: any) => font.value === selectedFont) || null}
      onChange={handleFontChange}
      options={fonts}
      placeholder="Select a font"
    />
  );
};

export default FontSelector;
