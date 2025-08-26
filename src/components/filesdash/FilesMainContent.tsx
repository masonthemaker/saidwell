"use client";

import { useState } from "react";
import FileUploadSection from "./FileUploadSection";
import FilesList from "./FilesList";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { useFiles } from "@/hooks/use-files";
import { useAuth } from "@/hooks/use-auth";

interface FilesMainContentProps {
  isNavExpanded: boolean;
}

export default function FilesMainContent({ isNavExpanded }: FilesMainContentProps) {
  const { 
    allFiles, 
    isLoading, 
    deleteFile, 
    downloadFile,
    totalSizeFormatted,
    refresh,
    error 
  } = useFiles();
  
  const { getCurrentClient, user } = useAuth();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    fileId: string | null;
    fileName: string | null;
  }>({
    isOpen: false,
    fileId: null,
    fileName: null
  });

  const handleDeleteRequest = (fileId: string, fileName: string) => {
    setDeleteModal({
      isOpen: true,
      fileId: fileId,
      fileName: fileName
    });
  };

  const confirmDeleteFile = async () => {
    if (deleteModal.fileId) {
      const success = await deleteFile(deleteModal.fileId);
      if (success) {
        console.log(`Deleted file with ID: ${deleteModal.fileId}`);
        // File list will automatically refresh due to useFiles hook re-rendering
      }
    }
    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      fileId: null,
      fileName: null
    });
  };

  // Transform file data to match FileItem interface
  const transformedFiles = allFiles.map(file => ({
    id: file.id,
    name: file.name,
    type: file.mime_type?.toUpperCase().split('/')[1] || 'FILE',
    size: file.size_formatted,
    uploadDate: file.uploaded_date_formatted,
    fileType: file.file_type
  }));
  return (
    <main 
      className={`
        absolute top-22 right-6 bottom-6
        ${isNavExpanded ? 'left-54' : 'left-22'} 
        transition-all duration-500 ease-out
        p-6
        bg-transparent
        overflow-y-auto scrollbar-hide
        flex flex-col
      `}
    >
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <div className="text-red-300 text-sm">{error}</div>
          </div>
        )}
        
        {/* Upload Section */}
        <FileUploadSection onUploadSuccess={refresh} />
        
        {/* Files List */}
        <FilesList 
          files={transformedFiles} 
          onDeleteRequest={handleDeleteRequest}
          isLoading={isLoading}
          totalSize={totalSizeFormatted}
          onDownload={async (fileId: string) => {
            const url = await downloadFile(fileId);
            if (url) {
              window.open(url, '_blank');
            }
          }}
        />
      </div>

      {/* Delete Confirmation Modal - Rendered at main content level */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteFile}
        title="Delete File"
        message="This action cannot be undone. The file will be permanently removed from your account."
        confirmText="Delete File"
        cancelText="Cancel"
        variant="danger"
        itemName={deleteModal.fileName || undefined}
      />
    </main>
  );
}
