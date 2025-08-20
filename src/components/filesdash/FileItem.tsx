"use client";

import { PiFileDuotone, PiImageDuotone, PiFileTextDuotone, PiTrashDuotone, PiDownloadDuotone, PiEyeDuotone } from "react-icons/pi";

export interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  fileType: 'document' | 'image' | 'text' | 'other';
}

interface FileItemProps {
  file: FileData;
  onDelete?: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
  onPreview?: (fileId: string) => void;
}

export default function FileItem({ file, onDelete, onDownload, onPreview }: FileItemProps) {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <PiImageDuotone className="w-6 h-6 text-[var(--color-hover-pink)]" />;
      case 'text':
        return <PiFileTextDuotone className="w-6 h-6 text-[var(--color-sky-blue)]" />;
      case 'document':
        return <PiFileDuotone className="w-6 h-6 text-[var(--color-grassy-green)]" />;
      default:
        return <PiFileDuotone className="w-6 h-6 text-[var(--color-main-accent)]" />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return 'bg-[var(--color-hover-pink)]/20 text-[var(--color-hover-pink)] border-[var(--color-hover-pink)]/30';
      case 'text':
        return 'bg-[var(--color-sky-blue)]/20 text-[var(--color-sky-blue)] border-[var(--color-sky-blue)]/30';
      case 'document':
        return 'bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border-[var(--color-grassy-green)]/30';
      default:
        return 'bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border-[var(--color-main-accent)]/30';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(file.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(file.id);
  };

  const handlePreview = () => {
    onPreview?.(file.id);
  };

  return (
    <div 
      onClick={handlePreview}
      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* File Icon */}
          <div className="p-3 bg-white/10 rounded-lg border border-white/20">
            {getFileIcon(file.fileType)}
          </div>
          
          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-medium text-white/90 truncate">{file.name}</h3>
              <span className={`px-2 py-1 text-xs border rounded-full ${getFileTypeColor(file.fileType)}`}>
                {file.type}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span>{file.size}</span>
              <span>•</span>
              <span>Uploaded {file.uploadDate}</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handlePreview}
            className="group p-2 bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40 rounded-lg border border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60 transition-all duration-300"
            aria-label={`Preview ${file.name}`}
          >
            <PiEyeDuotone className="w-4 h-4 text-[var(--color-sky-blue)] group-hover:brightness-125 transition-all duration-300" />
          </button>
          
          <button
            onClick={handleDownload}
            className="group p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300"
            aria-label={`Download ${file.name}`}
          >
            <PiDownloadDuotone className="w-4 h-4 text-white/70 group-hover:text-white transition-all duration-300" />
          </button>
          
          <button
            onClick={handleDelete}
            className="group p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg border border-red-500/30 hover:border-red-500/60 transition-all duration-300"
            aria-label={`Delete ${file.name}`}
          >
            <PiTrashDuotone className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-all duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
