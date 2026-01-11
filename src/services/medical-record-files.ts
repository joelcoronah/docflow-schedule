import { MedicalRecordFile } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const medicalRecordFilesService = {
  /**
   * Upload a single file
   */
  uploadFile: async (medicalRecordId: string, file: File): Promise<MedicalRecordFile> => {
    const formData = new FormData();
    // Create a new File with custom name if it exists
    const fileToUpload = (file as any).customName 
      ? new File([file], (file as any).customName, { type: file.type })
      : file;
    formData.append('file', fileToUpload);

    const response = await fetch(
      `${API_URL}/medical-records/${medicalRecordId}/files/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  },

  /**
   * Upload multiple files
   */
  uploadMultipleFiles: async (
    medicalRecordId: string,
    files: File[]
  ): Promise<MedicalRecordFile[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      // Create a new File with custom name if it exists
      const fileToUpload = (file as any).customName 
        ? new File([file], (file as any).customName, { type: file.type })
        : file;
      formData.append('files', fileToUpload);
    });

    const response = await fetch(
      `${API_URL}/medical-records/${medicalRecordId}/files/upload-multiple`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    return response.json();
  },

  /**
   * Get all files for a medical record
   */
  getFiles: async (medicalRecordId: string): Promise<MedicalRecordFile[]> => {
    const response = await fetch(
      `${API_URL}/medical-records/${medicalRecordId}/files`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    return response.json();
  },

  /**
   * Download a file
   */
  downloadFile: async (medicalRecordId: string, fileId: string): Promise<Blob> => {
    const response = await fetch(
      `${API_URL}/medical-records/${medicalRecordId}/files/file/${fileId}`
    );

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return response.blob();
  },

  /**
   * Get download URL for a file
   */
  getDownloadUrl: (medicalRecordId: string, fileId: string): string => {
    return `${API_URL}/medical-records/${medicalRecordId}/files/file/${fileId}`;
  },

  /**
   * Delete a file
   */
  deleteFile: async (medicalRecordId: string, fileId: string): Promise<void> => {
    const response = await fetch(
      `${API_URL}/medical-records/${medicalRecordId}/files/file/${fileId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  },

  /**
   * Rename a file
   */
  renameFile: async (
    medicalRecordId: string,
    fileId: string,
    newName: string
  ): Promise<MedicalRecordFile> => {
    const response = await fetch(
      `${API_URL}/medical-records/${medicalRecordId}/files/file/${fileId}/rename`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to rename file');
    }

    return response.json();
  },
};
