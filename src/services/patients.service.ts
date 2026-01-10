import { apiFetch } from './api';
import type { Patient } from '@/types';

export interface CreatePatientDto {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  notes?: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

export interface PatientsQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PatientsResponse {
  data: Patient[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Get all patients with optional search and pagination
 */
export async function getPatients(
  params?: PatientsQueryParams
): Promise<PatientsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  return apiFetch<PatientsResponse>(
    `/patients${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Get a patient by ID
 */
export async function getPatientById(id: string): Promise<Patient> {
  return apiFetch<Patient>(`/patients/${id}`);
}

/**
 * Create a new patient
 */
export async function createPatient(data: CreatePatientDto): Promise<Patient> {
  return apiFetch<Patient>('/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a patient
 */
export async function updatePatient(
  id: string,
  data: UpdatePatientDto
): Promise<Patient> {
  return apiFetch<Patient>(`/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a patient
 */
export async function deletePatient(id: string): Promise<void> {
  return apiFetch<void>(`/patients/${id}`, {
    method: 'DELETE',
  });
}
