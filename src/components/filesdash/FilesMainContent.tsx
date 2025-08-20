"use client";

import { useState } from "react";
import FileUploadSection from "./FileUploadSection";
import FilesList from "./FilesList";
import ConfirmationModal from "@/components/ui/confirmation-modal";

interface FilesMainContentProps {
  isNavExpanded: boolean;
}

export default function FilesMainContent({ isNavExpanded }: FilesMainContentProps) {
  const [files, setFiles] = useState([
    {
      id: "1",
      name: "Product_Requirements_Document.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2 hours ago",
      fileType: "document" as const
    },
    {
      id: "2", 
      name: "Marketing_Campaign_Images.zip",
      type: "ZIP",
      size: "15.7 MB",
      uploadDate: "Yesterday",
      fileType: "image" as const
    },
    {
      id: "3",
      name: "Meeting_Notes_Jan_2024.txt",
      type: "TXT", 
      size: "45 KB",
      uploadDate: "3 days ago",
      fileType: "text" as const
    }
  ]);

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

  const confirmDeleteFile = () => {
    if (deleteModal.fileId) {
      setFiles(prev => prev.filter(file => file.id !== deleteModal.fileId));
      console.log(`Deleted file with ID: ${deleteModal.fileId}`);
      // TODO: Implement actual file deletion when connected to backend
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      fileId: null,
      fileName: null
    });
  };
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
        {/* Upload Section */}
        <FileUploadSection />
        
        {/* Files List */}
        <FilesList files={files} onDeleteRequest={handleDeleteRequest} />
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
