# useFiles Hook

A React hook for managing file uploads and downloads in the Saidwell application with multi-tenant access control.

## Features

- **File Upload**: Upload files to Supabase Storage with metadata and tags
- **File Management**: List, update, and delete files with proper permissions
- **Multi-Tenant Access Control**: RLS-enforced isolation between companies and clients
- **File Download**: Generate signed URLs for secure file downloads
- **File Type Detection**: Automatic file type classification (document, image, text, etc.)
- **Size Formatting**: Human-readable file sizes and storage usage
- **Date Formatting**: Relative date formatting (today, yesterday, 3 days ago)

## Usage

```tsx
import { useFiles } from '@/hooks/use-files'

function FilesComponent() {
  const {
    allFiles,
    isLoading,
    isLoadingUpload,
    uploadFile,
    deleteFile,
    downloadFile,
    totalFiles,
    totalSizeFormatted,
    error
  } = useFiles()

  const handleUpload = async (file: File) => {
    const result = await uploadFile(file, {
      company_id: 'company-uuid',
      client_id: 'client-uuid', // optional - if null, only company can see
      metadata: { 
        category: 'documents',
        department: 'operations',
        priority: 'high'
      },
      tags: ['important', 'legal', 'onboarding']
    })
    
    if (result) {
      console.log('File uploaded:', result)
    }
  }

  const handleDownload = async (fileId: string) => {
    const url = await downloadFile(fileId)
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <div>
      {isLoading ? (
        <div>Loading files...</div>
      ) : (
        <div>
          <p>{totalFiles} files ({totalSizeFormatted})</p>
          {allFiles.map(file => (
            <div key={file.id}>
              <span>{file.name} - {file.size_formatted}</span>
              <button onClick={() => handleDownload(file.id)}>Download</button>
            </div>
          ))}
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  )
}
```

## Multi-Tenant Access Control

The hook implements secure row-level security matching the same patterns as calls and agent analytics:

### Company Users (Owner/Admin/Member)
- ✅ **View**: All files for their company (both company-only and client-assigned)
- ✅ **Upload**: Files for their company with optional client assignment
- ✅ **Delete**: Company admins can delete any company files, members can delete own files
- ✅ **Full Control**: Complete file management for their organization

### Client Users
- ✅ **View**: Only files assigned to their client organization
- ✅ **Upload**: Files for their client (automatically assigned to their client)
- ✅ **Delete**: Only files they personally uploaded
- ❌ **Restricted**: Cannot see company-only files or files for other clients

### File Visibility Examples

**Company uploads with `client_id = null`:**
- ✅ Company users can see it
- ❌ Client users cannot see it (company-only)

**Company uploads with `client_id = "client-123"`:**
- ✅ Company users can see it
- ✅ Client users from client-123 can see it
- ❌ Client users from other clients cannot see it

## File Types & Metadata

Files are automatically categorized by MIME type:
- `document`: PDF, Word, Excel, PowerPoint files
- `image`: JPEG, PNG, GIF, WebP, etc.
- `text`: Plain text, Markdown, RTF files
- `video`: MP4, WebM, AVI, etc.
- `audio`: MP3, WAV, OGG, etc.
- `other`: All other file types

### Custom Metadata
Store additional information with your files:
```tsx
metadata: {
  category: 'financial_report',
  department: 'accounting',
  quarter: 'Q4',
  year: 2024,
  confidentiality: 'internal'
}
```

### File Tags
Organize files with searchable tags:
```tsx
tags: ['quarterly', 'financial', 'board-presentation', 'confidential']
```

## Storage Structure

Files are stored in Supabase Storage with organized paths:
```
files/
  └── {user_id}/
      └── {timestamp}-{random_id}.{extension}

Example:
files/7b9b19e6-4cbb-4b17-9657-7470b75375d6/1732540800000-a1b2c3d4.pdf
```

## Database Schema

The `files` table structure:

```sql
CREATE TABLE public.files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,                    -- Display name
    original_name text NOT NULL,           -- Original filename
    mime_type text,                        -- File MIME type
    file_size bigint,                      -- Size in bytes
    bucket_name text DEFAULT 'files',     -- Storage bucket
    file_path text NOT NULL,              -- Path in storage
    company_id uuid NOT NULL,             -- Owner company
    client_id uuid,                       -- Assigned client (optional)
    uploaded_by uuid NOT NULL,            -- User who uploaded
    metadata jsonb DEFAULT '{}',          -- Custom metadata
    tags text[],                          -- File tags
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

### RLS Policies
- **Company members**: Can view all company files
- **Client users**: Can view files assigned to their client
- **Upload permissions**: Users can upload within their access scope
- **Delete permissions**: Admins can delete company files, users can delete own files

## API Reference

### Hook Return Values

```tsx
interface UseFilesReturn {
  // Loading states
  isLoading: boolean                    // Loading all files
  isLoadingUpload: boolean             // Uploading file(s)
  
  // Data
  allFiles: FileWithDetails[]          // All accessible files
  
  // Methods
  refresh: () => Promise<void>         // Reload files
  uploadFile: (file, data) => Promise<FileRecord | null>
  deleteFile: (fileId) => Promise<boolean>
  downloadFile: (fileId) => Promise<string | null>  // Returns signed URL
  updateFile: (fileId, updates) => Promise<FileRecord | null>
  
  // Computed values
  totalFiles: number                   // Count of files
  totalSize: number                   // Total bytes
  totalSizeFormatted: string          // Human readable size
  
  // Error handling
  error: string | null                // Error message
}
```

### File Types

```tsx
interface FileWithDetails {
  id: string
  name: string
  original_name: string
  mime_type: string | null
  file_size: number | null
  company_id: string
  client_id: string | null
  uploaded_by: string
  metadata: Record<string, any>
  tags: string[] | null
  created_at: string
  updated_at: string
  
  // Computed fields
  company_name?: string
  client_name?: string | null
  file_type: 'document' | 'image' | 'text' | 'video' | 'audio' | 'other'
  size_formatted: string
  uploaded_date_formatted: string
}
```

## Error Handling

The hook provides comprehensive error handling:

```tsx
const { error } = useFiles()

// Common error scenarios:
if (error) {
  switch (error) {
    case 'User not authenticated':
      // Handle auth error
      break
    case 'permission denied for table files':
      // Handle permission error  
      break
    case 'Storage quota exceeded':
      // Handle storage limit
      break
    default:
      // Handle other errors
      console.error('File operation failed:', error)
  }
}
```

## Security & Performance

### Security Features
- ✅ **Row Level Security**: Database-enforced access control
- ✅ **Signed URLs**: Time-limited download links (1 hour expiry)
- ✅ **Multi-tenant isolation**: Companies cannot access other companies' files
- ✅ **Client isolation**: Clients only see their assigned files

### Performance Optimizations
- ✅ **Automatic caching**: Files are cached until manual refresh
- ✅ **Efficient queries**: Uses indexed columns for fast lookups
- ✅ **Lazy loading**: Only loads file metadata, not actual file contents
- ✅ **Optimized storage**: Files organized by user for efficient retrieval

## Testing Access Control

The hook includes test files to verify access control:

**Company User** (`mason.adams38@gmail.com`):
- Sees all 3 files (including company-only files)

**Client User** (`clienttest@gmail.com`):  
- Sees only 2 files (assigned to their client)
- Cannot see company-only files

This demonstrates the working multi-tenant security model.
