import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medicalRecordFilesService } from '@/services/medical-record-files';
import { MedicalRecordFile } from '@/types';

export function useMedicalRecordFiles(medicalRecordId?: string) {
  return useQuery<MedicalRecordFile[]>({
    queryKey: ['medical-record-files', medicalRecordId],
    queryFn: () => medicalRecordFilesService.getFiles(medicalRecordId!),
    enabled: !!medicalRecordId,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      medicalRecordId,
      file,
    }: {
      medicalRecordId: string;
      file: File;
    }) => medicalRecordFilesService.uploadFile(medicalRecordId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['medical-record-files', variables.medicalRecordId],
      });
      queryClient.invalidateQueries({
        queryKey: ['medical-records'],
      });
    },
  });
}

export function useUploadMultipleFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      medicalRecordId,
      files,
    }: {
      medicalRecordId: string;
      files: File[];
    }) => medicalRecordFilesService.uploadMultipleFiles(medicalRecordId, files),
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['medical-record-files', variables.medicalRecordId],
      });
      queryClient.invalidateQueries({
        queryKey: ['medical-records'],
      });
      // Also invalidate patients queries to refresh medical records with files
      queryClient.invalidateQueries({
        queryKey: ['patients'],
      });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      medicalRecordId,
      fileId,
    }: {
      medicalRecordId: string;
      fileId: string;
    }) => medicalRecordFilesService.deleteFile(medicalRecordId, fileId),
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['medical-record-files', variables.medicalRecordId],
      });
      queryClient.invalidateQueries({
        queryKey: ['medical-records'],
      });
      // Also invalidate patients queries to refresh medical records with files
      queryClient.invalidateQueries({
        queryKey: ['patients'],
      });
    },
  });
}

export function useRenameFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      medicalRecordId,
      fileId,
      newName,
    }: {
      medicalRecordId: string;
      fileId: string;
      newName: string;
    }) => medicalRecordFilesService.renameFile(medicalRecordId, fileId, newName),
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['medical-record-files', variables.medicalRecordId],
      });
      queryClient.invalidateQueries({
        queryKey: ['medical-records'],
      });
      queryClient.invalidateQueries({
        queryKey: ['patients'],
      });
    },
  });
}
