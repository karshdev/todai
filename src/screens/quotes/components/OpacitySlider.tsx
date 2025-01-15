import { Blend } from "lucide-react";

interface OpacitySliderProps {
    showOpacitySlider: boolean;
    setShowOpacitySlider: (show: boolean) => void;
    bgOpacity: number;
    setBgOpacity: (opacity: number) => void;
    opacityRef: React.RefObject<HTMLDivElement>;
}

const OpacitySlider: React.FC<OpacitySliderProps> = ({
    showOpacitySlider,
    setShowOpacitySlider,
    bgOpacity,
    setBgOpacity,
    opacityRef,
}) => (
    <div className="relative">
        <button onClick={() => setShowOpacitySlider(!showOpacitySlider)} className="text-gray-700 hover:text-gray-900">
            <Blend className="w-7 h-7 mt-1" />
        </button>
        {showOpacitySlider && (
            <div ref={opacityRef} className="absolute top-full mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(Number(e.target.value))}
                    className="w-full"
                />
                <span className="block text-center mt-2">{Math.round(bgOpacity * 100)}%</span>
            </div>
        )}
    </div>
);

export default OpacitySlider