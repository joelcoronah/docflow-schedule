export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  createdAt: Date;
  notes: string;
  medicalHistory?: MedicalRecord[];
  medicalRecords?: MedicalRecord[];
  appointments?: Appointment[];
  updatedAt?: Date;
}

export interface MedicalRecord {
  id: string;
  date: Date;
  diagnosis: string;
  treatment: string;
  notes: string;
  attachments?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  time: string;
  duration: number;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
}

export type AppointmentType = 'checkup' | 'cleaning' | 'procedure' | 'consultation' | 'emergency' | 'follow-up';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'alert' | 'info';
  read: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  todayAppointments: number;
  weekAppointments: number;
  totalPatients: number;
  pendingFollowUps: number;
}
