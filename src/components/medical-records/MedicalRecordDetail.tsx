import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Download, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MedicalRecord } from "@/types";
import { FileList } from "./FileList";
import { FileUploader } from "./FileUploader";
import { parseDateFromAPI } from "@/lib/date-utils";
import { toast } from "sonner";

interface MedicalRecordDetailProps {
  record: MedicalRecord;
  onEdit: () => void;
  onDelete: () => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onUploadFiles: (files: File[]) => void;
  uploading?: boolean;
}

export function MedicalRecordDetail({
  record,
  onEdit,
  onDelete,
  onDeleteFile,
  onRenameFile,
  onUploadFiles,
  uploading = false,
}: MedicalRecordDetailProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    onUploadFiles(selectedFiles);
    setSelectedFiles([]);
    setShowUploadDialog(false);
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg text-foreground">
              {record.diagnosis}
            </h3>
            <Badge variant="outline">
              {format(parseDateFromAPI(record.date), "MMM d, yyyy")}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-foreground">Treatment: </span>
              <span className="text-muted-foreground">{record.treatment}</span>
            </div>
            
            {record.notes && (
              <div>
                <span className="font-medium text-foreground">Notes: </span>
                <span className="text-muted-foreground">{record.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            title="Edit record"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            title="Delete record"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Files Section */}
      {(record.files && record.files.length > 0) || true ? (
        <div className="pt-3 border-t space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Attached Files ({record.files?.length || 0})
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploadDialog(true)}
              className="gap-2"
            >
              <Upload className="h-3 w-3" />
              Add Files
            </Button>
          </div>

          {record.files && record.files.length > 0 ? (
            <FileList
              files={record.files}
              medicalRecordId={record.id}
              onDelete={onDeleteFile}
              onRename={onRenameFile}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No files attached yet
            </p>
          )}
        </div>
      ) : null}

      {/* Upload Files Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Files to Medical Record</DialogTitle>
          </DialogHeader>
          
          <FileUploader
            onFilesSelected={setSelectedFiles}
            maxFiles={5}
            maxSizeInMB={10}
            disabled={uploading}
          />

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadDialog(false);
                setSelectedFiles([]);
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medical Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              medical record and all attached files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
