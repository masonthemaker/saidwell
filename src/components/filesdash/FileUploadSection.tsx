"use client";

import { useState, useRef } from "react";
import { PiUploadDuotone, PiFileDuotone, PiCloudArrowUpDuotone } from "react-icons/pi";
import { useFiles } from "@/hooks/use-files";
import { useAuth } from "@/hooks/use-auth";

interface FileUploadSectionProps {
  onUploadSuccess: () => Promise<void>;
}

export default function FileUploadSection({ onUploadSuccess }: FileUploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { uploadFile, isLoadingUpload, error } = useFiles();
  const { user, getCurrentClient, memberships, isOwner, isAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (files: File[]) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const currentClient = getCurrentClient();
    
    // Handle both company users and client users
    let company_id: string;
    let client_id: string | null = null;
    
    if (currentClient) {
      // Client user: has a current client context
      company_id = currentClient.company_id;
      client_id = currentClient.client_id;
    } else if (memberships.length > 0) {
      // Company user: use first membership for company context, keep files company-only
      company_id = memberships[0].company_id;
      client_id = null; // Company-only files
    } else {
      console.error('No company or client context available');
      return;
    }

    let successCount = 0;
    
    for (const file of files) {
      const result = await uploadFile(file, {
        company_id: company_id,
        client_id: client_id,
        metadata: {
          uploaded_via: 'drag_drop',
          original_size: file.size,
          upload_timestamp: new Date().toISOString()
        },
        tags: ['user_uploaded']
      });

      if (result) {
        successCount++;
      } else {
        console.error(`Failed to upload: ${file.name}`);
      }
    }
    
    // Refresh files list if any uploads were successful
    if (successCount > 0) {
      // Add a small delay to ensure backend processing is complete
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
      
      await onUploadSuccess();
    }
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
          ${isLoadingUpload ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoadingUpload}
        />
        
        <div className="flex flex-col items-center gap-4">
          {isLoadingUpload ? (
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
        <button 
          onClick={handleBrowseClick}
          disabled={isLoadingUpload}
          className={`px-4 py-2 bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/30 rounded-lg text-sm font-medium hover:bg-[var(--color-main-accent)]/30 transition-all duration-300 ${isLoadingUpload ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <PiFileDuotone className="w-4 h-4 inline mr-2" />
          Browse Files
        </button>
      </div>
    </div>
  );
}
