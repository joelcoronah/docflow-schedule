import { apiFetch } from './api';
import type { MedicalRecord } from '@/types';

export interface CreateMedicalRecordDto {
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  attachments?: string[];
}

export interface UpdateMedicalRecordDto extends Partial<CreateMedicalRecordDto> {}

/**
 * Get medical records for a patient
 */
export async function getMedicalRecordsByPatient(
  patientId: string
): Promise<{ data: MedicalRecord[] }> {
  return apiFetch<{ data: MedicalRecord[] }>(
    `/medical-records/patient/${patientId}`
  );
}

/**
 * Get a medical record by ID
 */
export async function getMedicalRecordById(id: string): Promise<MedicalRecord> {
  return apiFetch<MedicalRecord>(`/medical-records/${id}`);
}

/**
 * Create a new medical record for a patient
 */
export async function createMedicalRecord(
  patientId: string,
  data: CreateMedicalRecordDto
): Promise<MedicalRecord> {
  return apiFetch<MedicalRecord>(`/medical-records/patient/${patientId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a medical record
 */
export async function updateMedicalRecord(
  id: string,
  data: UpdateMedicalRecordDto
): Promise<MedicalRecord> {
  return apiFetch<MedicalRecord>(`/medical-records/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a medical record
 */
export async function deleteMedicalRecord(id: string): Promise<void> {
  return apiFetch<void>(`/medical-records/${id}`, {
    method: 'DELETE',
  });
}
