"use client";

import { useState } from "react";
import { PiUploadDuotone, PiFileDuotone, PiCloudArrowUpDuotone } from "react-icons/pi";

export default function FileUploadSection() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Uploading ${files.length} file(s):`, files.map(f => f.name));
    setIsUploading(false);
    // TODO: Implement actual file upload when connected to backend
  };

  return (
    <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white/90 mb-2">Upload Files</h2>
        <p className="text-sm text-white/60">Drag and drop files here or click to browse</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-[var(--color-main-accent)]/60 bg-[var(--color-main-accent)]/10' 
            : 'border-white/20 hover:border-white/30 hover:bg-white/5'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <div className="p-4 bg-[var(--color-sky-blue)]/20 rounded-full">
                <PiCloudArrowUpDuotone className="w-8 h-8 text-[var(--color-sky-blue)] animate-bounce" />
              </div>
              <div>
                <div className="text-lg font-medium text-white/90 mb-2">Uploading files...</div>
                <div className="w-48 bg-white/20 rounded-full h-2">
                  <div className="bg-[var(--color-sky-blue)] h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-full ${isDragOver ? 'bg-[var(--color-main-accent)]/20' : 'bg-white/10'}`}>
                <PiUploadDuotone className={`w-8 h-8 ${isDragOver ? 'text-[var(--color-main-accent)]' : 'text-white/70'}`} />
              </div>
              <div>
                <div className="text-lg font-medium text-white/90 mb-1">
                  {isDragOver ? 'Drop files here' : 'Choose files to upload'}
                </div>
                <div className="text-sm text-white/60">
                  Support for multiple file types • Max 10MB per file
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Upload Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/30 rounded-lg text-sm font-medium hover:bg-[var(--color-main-accent)]/30 transition-all duration-300">
          <PiFileDuotone className="w-4 h-4 inline mr-2" />
          Browse Files
        </button>
        <button className="px-4 py-2 bg-white/10 text-white/80 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300">
          Upload from URL
        </button>
      </div>
    </div>
  );
}
