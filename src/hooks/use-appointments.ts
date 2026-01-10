import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAppointments,
  getAppointmentById,
  getAppointmentsByPatient,
  getAppointmentsByDate,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  type AppointmentsQueryParams,
  type CreateAppointmentDto,
  type UpdateAppointmentDto,
} from '@/services/appointments.service';

// Query keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params?: AppointmentsQueryParams) =>
    [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  byPatient: (patientId: string) =>
    [...appointmentKeys.all, 'patient', patientId] as const,
  byDate: (date: string) => [...appointmentKeys.all, 'date', date] as const,
};

/**
 * Hook to fetch all appointments
 */
export function useAppointments(params?: AppointmentsQueryParams) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => getAppointments(params),
  });
}

/**
 * Hook to fetch a single appointment by ID
 */
export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => getAppointmentById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch appointments by patient ID
 */
export function useAppointmentsByPatient(patientId: string) {
  return useQuery({
    queryKey: appointmentKeys.byPatient(patientId),
    queryFn: () => getAppointmentsByPatient(patientId),
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch appointments by date
 */
export function useAppointmentsByDate(date: string) {
  return useQuery({
    queryKey: appointmentKeys.byDate(date),
    queryFn: () => getAppointmentsByDate(date),
    enabled: !!date,
  });
}

/**
 * Hook to create a new appointment
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentDto) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/**
 * Hook to update an appointment
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentDto }) =>
      updateAppointment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/**
 * Hook to delete an appointment
 */
export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
