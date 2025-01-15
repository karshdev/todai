// Utility function to convert hex to RGBA
export const hexToRgba = (hex: string, alpha: number = 1): string => {
    const hexCode = hex.replace("#", "");
    const r = parseInt(hexCode.substring(0, 2), 16);
    const g = parseInt(hexCode.substring(2, 4), 16);
    const b = parseInt(hexCode.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export async function urlToFile(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    const mimeType = blob.type;

    const fileName = `file-${Date.now()}.${mimeType.split('/')[1]}`;

    return new File([blob], fileName, { type: mimeType });
}


  // Usage:
  // formatSubtitleTime("00:00:04,320") -> "0:00:04"
export const formatSubtitleTime = (timeStr: string) => {
    const [hours, minutes, secondsWithMs] = timeStr.split(':');
    const [seconds] = secondsWithMs.split(',');
    
    const totalSeconds = 
      parseInt(hours) * 3600 + 
      parseInt(minutes) * 60 + 
      parseInt(seconds);
      
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
