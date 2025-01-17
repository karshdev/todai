import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader,
  Download,
} from "lucide-react";

// Set worker source with HTTPS
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

// Preload the worker
const preloadWorker = async () => {
  try {
    await pdfjs.getDocument({ data: new Uint8Array() }).promise;
  } catch (e) {
    // Ignore the error as this is just for preloading
  }
};
const options = {
  cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/cmaps/",
  cMapPacked: true,
  textLayerMode: 0, // Disable text layer
  removeTextLayerSecurity: true,
};

/// Types
type PDFFile = string | File | ArrayBuffer | Blob;

interface PDFViewerProps {
  file: PDFFile;
  className?: string;
  initialPage?: number;
  initialScale?: number;
  onPageChange?: (page: number) => void;
  onScaleChange?: (scale: number) => void;
  onDocumentLoad?: (pdf: any) => void;
  enableDownload?: boolean;
}

const UniversalPDFViewer: React.FC<PDFViewerProps> = ({
  file,
  className = "",
  initialPage = 1,
  initialScale = 1.0,
  onPageChange,
  onScaleChange,
  onDocumentLoad,
  enableDownload = true,
}) => {
  const [state, setState] = useState({
    numPages: null,
    pageNumber: initialPage,
    scale: initialScale,
    loading: true,
    error: null as string | null,
    pdfFile: null as PDFFile | null,
    workerLoaded: false,
  });

  // Initialize worker
  useEffect(() => {
    const initializeWorker = async () => {
      try {
        await preloadWorker();
        setState((prev) => ({ ...prev, workerLoaded: true }));
      } catch (error) {
        console.error("Worker initialization error:", error);
        setState((prev) => ({
          ...prev,
          error: "PDF viewer initialization failed",
          loading: false,
        }));
      }
    };

    initializeWorker();
  }, []);

  // Handle file processing when the file prop changes
  useEffect(() => {
    const processPDFFile = async () => {
      if (!state.workerLoaded) return;

      try {
        if (!file) {
          setState((prev) => ({
            ...prev,
            error: "No PDF file provided",
            loading: false,
          }));
          return;
        }

        // If file is already a Blob, ensure it has the correct type
        if (file instanceof Blob) {
          const pdfBlob =
            file.type === "application/pdf"
              ? file
              : new Blob([file], { type: "application/pdf" });
          setState((prev) => ({
            ...prev,
            pdfFile: pdfBlob,
            error: null,
          }));
          return;
        }

        // Handle other file types
        setState((prev) => ({
          ...prev,
          pdfFile: file,
          error: null,
        }));
      } catch (error) {
        console.error("Error processing PDF file:", error);
        setState((prev) => ({
          ...prev,
          error: "Error processing PDF file",
          loading: false,
        }));
      }
    };

    processPDFFile();
  }, [file, state.workerLoaded]);

  const handleDocumentLoadSuccess = ({ numPages }: any): void => {
    setState((prev) => ({ ...prev, numPages, loading: false }));
    onDocumentLoad?.(numPages);
  };

  const handleDocumentLoadError = (error: Error): void => {
    console.error("PDF Load Error:", error);
    setState((prev) => ({
      ...prev,
      error: "Error loading PDF. Please check if the file is valid.",
      loading: false,
    }));
  };

  //   const handleDownload = async (): Promise<void> => {
  //     try {
  //       if (state.pdfFile instanceof Blob) {
  //         const url = URL.createObjectURL(state.pdfFile);
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.download = "document.pdf";
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         URL.revokeObjectURL(url);
  //       }
  //     } catch (error) {
  //       console.error("Download error:", error);
  //     }
  //   };

  if (!state.workerLoaded) {
    return (
      <div className="flex items-center justify-center w-full max-w-4xl h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between p-2 border-b bg-slate-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const newPage = state.pageNumber - 1;
              if (newPage >= 1) {
                setState((prev) => ({ ...prev, pageNumber: newPage }));
                onPageChange?.(newPage);
              }
            }}
            disabled={state.pageNumber <= 1}
            className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm">
            Page {state.pageNumber} of {state.numPages || "-"}
          </span>

          <button
            onClick={() => {
              const newPage = state.pageNumber + 1;
              if (newPage <= (state.numPages || 1)) {
                setState((prev) => ({ ...prev, pageNumber: newPage }));
                onPageChange?.(newPage);
              }
            }}
            disabled={state.pageNumber >= (state.numPages || 1)}
            className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const newScale = Math.max(0.5, state.scale - 0.2);
              setState((prev) => ({ ...prev, scale: newScale }));
              onScaleChange?.(newScale);
            }}
            className="p-2 hover:bg-gray-100 rounded-full">
            <ZoomOut className="w-5 h-5" />
          </button>

          <span className="text-sm">{Math.round(state.scale * 100)}%</span>

          <button
            onClick={() => {
              const newScale = Math.min(2, state.scale + 0.2);
              setState((prev) => ({ ...prev, scale: newScale }));
              onScaleChange?.(newScale);
            }}
            className="p-2 hover:bg-gray-100 rounded-full">
            <ZoomIn className="w-5 h-5" />
          </button>

          {enableDownload && (
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-full">
              <Download className="w-5 h-5" />
            </button>
          )}
        </div> */}
      </div>

      {/* PDF Display Area */}
      <div className="relative bg-gray-100 p-4 min-h-fit overflow-auto">
        {state.loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        )}

        {state.error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            {state.error}
          </div>
        )}

        <div className="flex justify-center">
          {state.pdfFile && (
            <Document
              file={state.pdfFile}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              options={options}
              loading={
                <div className="flex items-center justify-center h-60">
                  <Loader className="w-8 h-8 animate-spin" />
                </div>
              }>
              <Page
                pageNumber={state.pageNumber}
                scale={state.scale}
                className="shadow-lg"
                loading={
                  <div className="flex items-center justify-center h-60">
                    <Loader className="w-8 h-8 animate-spin" />
                  </div>
                }
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalPDFViewer;
