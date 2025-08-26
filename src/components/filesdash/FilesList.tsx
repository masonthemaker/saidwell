"use client";

import FileItem, { FileData } from "./FileItem";

interface FilesListProps {
  files: FileData[];
  onDeleteRequest?: (fileId: string, fileName: string) => void;
  onDownload?: (fileId: string) => void;
  isLoading?: boolean;
  totalSize?: string;
}

export default function FilesList({ 
  files, 
  onDeleteRequest, 
  onDownload, 
  isLoading = false,
  totalSize = "0 B"
}: FilesListProps) {

  const handleDeleteFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file && onDeleteRequest) {
      onDeleteRequest(fileId, file.name);
    }
  };

  const handleDownloadFile = (fileId: string) => {
    if (onDownload) {
      onDownload(fileId);
    } else {
      const file = files.find(f => f.id === fileId);
      console.log(`Downloading file: ${file?.name}`);
    }
  };

  const handlePreviewFile = (fileId: string) => {
    // For now, just trigger download for preview
    handleDownloadFile(fileId);
  };

  return (
    <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-white/90">Your Files</h2>
          <div className="text-sm text-white/50">{files.length} file{files.length !== 1 ? 's' : ''}</div>
        </div>
        <p className="text-sm text-white/60">Manage your uploaded files and documents</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {/* Loading skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg w-14 h-14"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded"></div>
                  <div className="w-8 h-8 bg-white/10 rounded"></div>
                  <div className="w-8 h-8 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : files.length > 0 ? (
        <div className="space-y-3">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onDelete={handleDeleteFile}
              onDownload={handleDownloadFile}
              onPreview={handlePreviewFile}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-white/50 mb-2">No files uploaded yet</div>
          <div className="text-xs text-white/40">Upload your first file using the section above</div>
        </div>
      )}

      {/* Storage Info */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Storage used</span>
          <span className="text-white/80">{totalSize}</span>
        </div>
        <div className="mt-2 w-full bg-white/20 rounded-full h-1">
          <div className="bg-[var(--color-main-accent)] h-1 rounded-full w-1/12"></div>
        </div>
      </div>


    </div>
  );
}
