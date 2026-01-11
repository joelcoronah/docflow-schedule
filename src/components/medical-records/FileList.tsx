import { useState } from 'react';
import { Download, Trash2, FileText, Image as ImageIcon, File, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MedicalRecordFile } from '@/types';
import { medicalRecordFilesService } from '@/services/medical-record-files';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface FileListProps {
  files: MedicalRecordFile[];
  medicalRecordId: string;
  onDelete?: (fileId: string) => void;
  onRename?: (fileId: string, newName: string) => void;
  readonly?: boolean;
}

export function FileList({
  files,
  medicalRecordId,
  onDelete,
  onRename,
  readonly = false,
}: FileListProps) {
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (mimeType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = async (file: MedicalRecordFile) => {
    try {
      const blob = await medicalRecordFilesService.downloadFile(
        medicalRecordId,
        file.id
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
      console.error(error);
    }
  };

  const startEditingFileName = (file: MedicalRecordFile) => {
    const nameWithoutExt = file.originalName.substring(0, file.originalName.lastIndexOf('.')) || file.originalName;
    setEditingFileId(file.id);
    setEditingName(nameWithoutExt);
  };

  const saveFileName = async (file: MedicalRecordFile) => {
    if (!editingName.trim()) {
      toast.error('Filename cannot be empty');
      return;
    }

    const extension = file.originalName.substring(file.originalName.lastIndexOf('.'));
    const newName = editingName.trim() + extension;

    if (onRename) {
      onRename(file.id, newName);
    }

    setEditingFileId(null);
    setEditingName('');
  };

  const cancelEditing = () => {
    setEditingFileId(null);
    setEditingName('');
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No files attached
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
        >
          <div>{getFileIcon(file.mimeType)}</div>
          <div className="flex-1 min-w-0">
            {editingFileId === file.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveFileName(file);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => saveFileName(file)}
                  className="h-8 px-2"
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEditing}
                  className="h-8 px-2"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium truncate">{file.originalName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.fileSize)} •{' '}
                  {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
                </p>
              </>
            )}
          </div>
          {editingFileId !== file.id && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(file)}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              {!readonly && onRename && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEditingFileName(file)}
                  title="Rename"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {!readonly && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(file.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
