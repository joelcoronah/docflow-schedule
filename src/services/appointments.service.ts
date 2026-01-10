import { apiFetch } from './api';
import type { Appointment, AppointmentType, AppointmentStatus } from '@/types';

export interface CreateAppointmentDto {
  patientId: string;
  date: string;
  time: string;
  duration?: number;
  type?: AppointmentType;
  status?: AppointmentStatus;
  notes?: string;
}

export interface UpdateAppointmentDto extends Partial<CreateAppointmentDto> {}

export interface AppointmentsQueryParams {
  date?: string;
  patientId?: string;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentsResponse {
  data: Appointment[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Get all appointments with optional filters
 */
export async function getAppointments(
  params?: AppointmentsQueryParams
): Promise<AppointmentsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.date) queryParams.append('date', params.date);
  if (params?.patientId) queryParams.append('patientId', params.patientId);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  return apiFetch<AppointmentsResponse>(
    `/appointments${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Get an appointment by ID
 */
export async function getAppointmentById(id: string): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}`);
}

/**
 * Get appointments by patient ID
 */
export async function getAppointmentsByPatient(
  patientId: string
): Promise<{ data: Appointment[] }> {
  return apiFetch<{ data: Appointment[] }>(`/appointments/patient/${patientId}`);
}

/**
 * Get appointments by date
 */
export async function getAppointmentsByDate(
  date: string
): Promise<{ data: Appointment[] }> {
  return apiFetch<{ data: Appointment[] }>(`/appointments/date/${date}`);
}

/**
 * Create a new appointment
 */
export async function createAppointment(
  data: CreateAppointmentDto
): Promise<Appointment> {
  return apiFetch<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an appointment
 */
export async function updateAppointment(
  id: string,
  data: UpdateAppointmentDto
): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete an appointment
 */
export async function deleteAppointment(id: string): Promise<void> {
  return apiFetch<void>(`/appointments/${id}`, {
    method: 'DELETE',
  });
}
