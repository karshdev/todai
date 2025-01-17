import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}


export async function convertBlobToBase64(blob: Blob): Promise<string> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
         // Check if reader.result is a non-null string
         if (typeof reader.result === "string") {
            const base64String = reader.result.split(",")[1];
            resolve(base64String);
         } else {
            reject(new Error("Failed to convert Blob to base64: result is not a valid string"));
         }
      };

      reader.onerror = () => {
         reject(new Error("Error reading Blob as Data URL"));
      };

      // Handle unexpected issues with FileReader
      try {
         reader.readAsDataURL(blob);
      } catch (error) {
         reject(new Error(`Unexpected error reading Blob: ${(error as Error).message}`));
      }
   });
}

export function convertBlobToFile(blob: any, fileName: string) {
   return new File([blob], fileName, { type: blob.type });
}

export function getFileTypeFromUrl(url: string): string {
   // Check if the URL is a base64 data URL
   if (url.startsWith("data:")) {
      const mimeType = url.split(";")[0].slice(5); // Extract mime type from data URL (e.g., "image/png")
      if (mimeType.startsWith("image")) return "image";
      if (mimeType.startsWith("video")) return "video";
      if (mimeType.startsWith("audio")) return "audio";
      if (mimeType === "application/pdf") return "pdf";
      if (mimeType === "text/plain") return "text";
      if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
         mimeType === "application/msword") return "document";
      if (mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
         mimeType === "application/vnd.ms-excel") return "spreadsheet";
      return "base64"; // Default for other base64 types
   }

   // If it's not a data URL, check the file extension
   const extension = url.split('.').pop()?.toLowerCase();
   const fileTypes: { [key: string]: string } = {
      pdf: "pdf",
      jpg: "image",
      jpeg: "image",
      png: "image",
      gif: "image",
      bmp: "image",
      svg: "image",
      mp4: "video",
      avi: "video",
      mov: "video",
      mkv: "video",
      webm: "video",
      mp3: "audio",
      wav: "audio",
      flac: "audio",
      txt: "text",
      doc: "document",
      docx: "document",
      xls: "spreadsheet",
      xlsx: "spreadsheet",
   };
   return extension && fileTypes[extension] ? fileTypes[extension] : "image";
}
