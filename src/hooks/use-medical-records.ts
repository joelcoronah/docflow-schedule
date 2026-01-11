import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMedicalRecordsByPatient,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  type CreateMedicalRecordDto,
  type UpdateMedicalRecordDto,
} from '@/services/medical-records.service';

// Query keys
export const medicalRecordKeys = {
  all: ['medical-records'] as const,
  byPatient: (patientId: string) =>
    [...medicalRecordKeys.all, 'patient', patientId] as const,
  detail: (id: string) => [...medicalRecordKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch medical records for a patient
 */
export function useMedicalRecordsByPatient(patientId: string) {
  return useQuery({
    queryKey: medicalRecordKeys.byPatient(patientId),
    queryFn: () => getMedicalRecordsByPatient(patientId),
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch a single medical record by ID
 */
export function useMedicalRecord(id: string) {
  return useQuery({
    queryKey: medicalRecordKeys.detail(id),
    queryFn: () => getMedicalRecordById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new medical record
 */
export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: CreateMedicalRecordDto;
    }) => createMedicalRecord(patientId, data),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({
        queryKey: medicalRecordKeys.byPatient(patientId),
      });
      // Also invalidate patient details to refresh the medical records
      queryClient.invalidateQueries({ queryKey: ['patients', 'detail', patientId] });
    },
  });
}

/**
 * Hook to update a medical record
 */
export function useUpdateMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicalRecordDto }) =>
      updateMedicalRecord(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.all });
      // Also invalidate patients queries
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

/**
 * Hook to delete a medical record
 */
export function useDeleteMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedicalRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.all });
      // Also invalidate patients queries
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
