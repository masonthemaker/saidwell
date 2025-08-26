export interface FileRecord {
  id: string
  name: string
  original_name: string
  mime_type: string | null
  file_size: number | null
  bucket_name: string
  file_path: string
  company_id: string
  client_id: string | null
  uploaded_by: string
  metadata: Record<string, any>
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface FileWithDetails extends FileRecord {
  company_name?: string
  client_name?: string | null
  uploader_email?: string
  file_type: 'document' | 'image' | 'text' | 'video' | 'audio' | 'other'
  size_formatted: string
  uploaded_date_formatted: string
}

export interface FileUploadData {
  name: string
  original_name: string
  mime_type: string
  file_size: number
  bucket_name: string
  file_path: string
  company_id: string
  client_id?: string | null
  metadata?: Record<string, any>
  tags?: string[]
}

export interface UseFilesReturn {
  // Loading states
  isLoading: boolean
  isLoadingUpload: boolean
  
  // Data
  allFiles: FileWithDetails[]
  
  // Methods
  refresh: () => Promise<void>
  uploadFile: (file: File, data: Partial<FileUploadData>) => Promise<FileRecord | null>
  deleteFile: (fileId: string) => Promise<boolean>
  downloadFile: (fileId: string) => Promise<string | null>
  updateFile: (fileId: string, updates: Partial<FileRecord>) => Promise<FileRecord | null>
  
  // Computed values
  totalFiles: number
  totalSize: number
  totalSizeFormatted: string
  
  // Error handling
  error: string | null
}

export type FileType = 'document' | 'image' | 'text' | 'video' | 'audio' | 'other'
