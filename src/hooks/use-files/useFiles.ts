import { useEffect, useMemo, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import type { FileRecord, FileWithDetails, FileUploadData, UseFilesReturn, FileType } from './types'

export function useFiles(): UseFilesReturn {
  const supabase = useMemo(() => createClient(), [])
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingUpload, setIsLoadingUpload] = useState(false)
  const [allFiles, setAllFiles] = useState<FileWithDetails[]>([])
  const [error, setError] = useState<string | null>(null)

  // Helper function to format file size
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
  }

  // Helper function to format date
  const formatUploadDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    
    return date.toLocaleDateString()
  }

  // Helper function to determine file type from MIME type
  const getFileType = (mimeType: string | null, fileName: string): FileType => {
    if (!mimeType) {
      const ext = fileName.split('.').pop()?.toLowerCase()
      if (['txt', 'md', 'rtf'].includes(ext || '')) return 'text'
      if (['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext || '')) return 'document'
      return 'other'
    }

    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.startsWith('text/')) return 'text'
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('spreadsheet') || mimeType.includes('presentation')) {
      return 'document'
    }
    return 'other'
  }

  const loadAllFiles = useCallback(async () => {
    if (!user) {
      setAllFiles([])
      setError(null)
      return
    }

    try {
      setError(null)
      
      // RLS policies will automatically filter based on user's access level
      // Company owners/admins see all company files
      // Client users see only files for their clients
      // Using same query pattern as calls and agent analytics which work perfectly
      const { data, error: queryError } = await supabase
        .from('files')
        .select(`
          *,
          companies (
            id,
            name
          ),
          clients (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (queryError) {
        console.error('Error loading files:', queryError)
        setError(queryError.message)
        setAllFiles([])
        return
      }

      const formattedData: FileWithDetails[] = (data || []).map(item => ({
        ...item,
        // Ensure proper typing for arrays
        tags: item.tags || [],
        metadata: item.metadata || {},
        // Add the joined data (companies might be null for client users)
        company_name: item.companies?.name || 'Unknown Company',
        client_name: item.clients?.name || null,
        // Add computed fields
        file_type: getFileType(item.mime_type, item.name),
        size_formatted: formatFileSize(item.file_size),
        uploaded_date_formatted: formatUploadDate(item.created_at)
      }))

      setAllFiles(formattedData)
    } catch (err) {
      console.error('Error in loadAllFiles:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setAllFiles([])
    }
  }, [supabase, user])

  const uploadFile = useCallback(async (file: File, data: Partial<FileUploadData>): Promise<FileRecord | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    try {
      setIsLoadingUpload(true)
      setError(null)

      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        setError(uploadError.message)
        return null
      }

      // Create file record in database
      const fileRecord = {
        name: data.name || file.name,
        original_name: file.name,
        mime_type: file.type || null,
        file_size: file.size,
        bucket_name: 'files',
        file_path: filePath,
        company_id: data.company_id!,
        client_id: data.client_id || null,
        metadata: data.metadata || {},
        tags: data.tags || []
      }

      const { data: dbData, error: dbError } = await supabase
        .from('files')
        .insert(fileRecord)
        .select()
        .single()

      if (dbError) {
        console.error('Database insert error:', dbError)
        // Clean up uploaded file if DB insert fails
        await supabase.storage.from('files').remove([filePath])
        setError(dbError.message)
        return null
      }

      // Refresh the files list
      await loadAllFiles()
      return dbData
    } catch (err) {
      console.error('Error in uploadFile:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return null
    } finally {
      setIsLoadingUpload(false)
    }
  }, [supabase, user, loadAllFiles])

  const deleteFile = useCallback(async (fileId: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated')
      return false
    }

    try {
      setError(null)

      // Get file info first
      const { data: fileData, error: fetchError } = await supabase
        .from('files')
        .select('file_path')
        .eq('id', fileId)
        .single()

      if (fetchError) {
        console.error('Error fetching file:', fetchError)
        setError(fetchError.message)
        return false
      }

      // Delete from database first
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)

      if (dbError) {
        console.error('Database delete error:', dbError)
        setError(dbError.message)
        return false
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([fileData.file_path])

      if (storageError) {
        console.error('Storage delete error:', storageError)
        // Don't throw error here as the DB record is already deleted
      }

      // Refresh the files list
      await loadAllFiles()
      return true
    } catch (err) {
      console.error('Error in deleteFile:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return false
    }
  }, [supabase, user, loadAllFiles])

  const downloadFile = useCallback(async (fileId: string): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    try {
      setError(null)

      // Get file info
      const { data: fileData, error: fetchError } = await supabase
        .from('files')
        .select('file_path, name')
        .eq('id', fileId)
        .single()

      if (fetchError) {
        console.error('Error fetching file:', fetchError)
        setError(fetchError.message)
        return null
      }

      // Create signed URL for download
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('files')
        .createSignedUrl(fileData.file_path, 3600) // 1 hour expiry

      if (urlError) {
        console.error('Error creating signed URL:', urlError)
        setError(urlError.message)
        return null
      }

      return signedUrlData.signedUrl
    } catch (err) {
      console.error('Error in downloadFile:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return null
    }
  }, [supabase, user])

  const updateFile = useCallback(async (fileId: string, updates: Partial<FileRecord>): Promise<FileRecord | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    try {
      setError(null)

      const { data, error: updateError } = await supabase
        .from('files')
        .update(updates)
        .eq('id', fileId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating file:', updateError)
        setError(updateError.message)
        return null
      }

      // Refresh the files list
      await loadAllFiles()
      return data
    } catch (err) {
      console.error('Error in updateFile:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return null
    }
  }, [supabase, user, loadAllFiles])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      await loadAllFiles()
    } finally {
      setIsLoading(false)
    }
  }, [loadAllFiles])

  // Computed values
  const totalFiles = useMemo(() => allFiles.length, [allFiles])

  const totalSize = useMemo(() => {
    return allFiles.reduce((sum, file) => sum + (file.file_size || 0), 0)
  }, [allFiles])

  const totalSizeFormatted = useMemo(() => formatFileSize(totalSize), [totalSize])

  // Load data on mount and when user changes
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        await loadAllFiles()
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [loadAllFiles])

  return {
    // Loading states
    isLoading,
    isLoadingUpload,
    
    // Data
    allFiles,
    
    // Methods
    refresh,
    uploadFile,
    deleteFile,
    downloadFile,
    updateFile,
    
    // Computed values
    totalFiles,
    totalSize,
    totalSizeFormatted,
    
    // Error handling
    error
  }
}

export default useFiles
