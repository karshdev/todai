import { TodaiImage } from "@/components/TodaiImage";
import borderRadiusIcon from '@/assets/img/border-radius.svg';


interface CornerRadiusSliderProps {
    showCornerRadiusSlider: boolean;
    setShowCornerRadiusSlider: (show: boolean) => void;
    cornerRadius: number;
    setCornerRadius: (radius: number) => void;
    cornerRadiusRef: React.RefObject<HTMLDivElement>;
}

const CornerRadiusSlider: React.FC<CornerRadiusSliderProps> = ({
    showCornerRadiusSlider,
    setShowCornerRadiusSlider,
    cornerRadius,
    setCornerRadius,
    cornerRadiusRef,
}) => (
    <div className="relative">
        <button onClick={() => setShowCornerRadiusSlider(!showCornerRadiusSlider)} className="text-gray-700 hover:text-gray-900">
            <TodaiImage src={borderRadiusIcon} alt="Border Radius" className="w-7 h-7 mt-1" height={20} width={20} />
        </button>
        {showCornerRadiusSlider && (
            <div
                ref={cornerRadiusRef}
                className="absolute top-full mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10"
            >
                <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={cornerRadius}
                    onChange={(e) => setCornerRadius(Number(e.target.value))}
                    className="w-full"
                />
                <span className="block text-center mt-2">{cornerRadius}px</span>
            </div>
        )}
    </div>
);

export default CornerRadiusSlider;