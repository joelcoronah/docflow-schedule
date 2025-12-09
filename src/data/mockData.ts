import { Patient, Appointment, Notification, DashboardStats } from '@/types';
import { addDays, subDays, setHours, setMinutes } from 'date-fns';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-03-15',
    address: '123 Oak Street, Springfield',
    createdAt: subDays(new Date(), 120),
    notes: 'Allergic to penicillin. Prefers morning appointments.',
    medicalHistory: [
      { id: 'm1', date: subDays(new Date(), 30), diagnosis: 'Routine checkup', treatment: 'Cleaning and fluoride treatment', notes: 'No cavities found' },
      { id: 'm2', date: subDays(new Date(), 180), diagnosis: 'Cavity - upper right molar', treatment: 'Filling placed', notes: 'Patient tolerated procedure well' },
    ],
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1990-07-22',
    address: '456 Maple Avenue, Riverside',
    createdAt: subDays(new Date(), 90),
    notes: 'New patient. Referred by Dr. Smith.',
    medicalHistory: [
      { id: 'm3', date: subDays(new Date(), 14), diagnosis: 'Initial consultation', treatment: 'Full examination and X-rays', notes: 'Recommended wisdom teeth extraction' },
    ],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 345-6789',
    dateOfBirth: '1978-11-08',
    address: '789 Pine Road, Lakewood',
    createdAt: subDays(new Date(), 365),
    notes: 'Long-term patient. History of gum sensitivity.',
    medicalHistory: [
      { id: 'm4', date: subDays(new Date(), 7), diagnosis: 'Gum inflammation', treatment: 'Deep cleaning scheduled', notes: 'Follow-up in 2 weeks' },
      { id: 'm5', date: subDays(new Date(), 90), diagnosis: 'Routine checkup', treatment: 'Standard cleaning', notes: 'Minor plaque buildup' },
    ],
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.t@email.com',
    phone: '(555) 456-7890',
    dateOfBirth: '1995-02-28',
    address: '321 Cedar Lane, Hillside',
    createdAt: subDays(new Date(), 45),
    notes: 'Dental anxiety - recommend sedation options.',
    medicalHistory: [],
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    email: 'lisa.martinez@email.com',
    phone: '(555) 567-8901',
    dateOfBirth: '1982-09-12',
    address: '654 Birch Street, Meadowbrook',
    createdAt: subDays(new Date(), 200),
    notes: 'Orthodontic treatment in progress.',
    medicalHistory: [
      { id: 'm6', date: subDays(new Date(), 21), diagnosis: 'Braces adjustment', treatment: 'Wire tightened', notes: 'Next appointment in 6 weeks' },
    ],
  },
];

const today = new Date();
const createTime = (hour: number, minute: number) => {
  return setMinutes(setHours(new Date(), hour), minute);
};

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: today,
    time: '09:00',
    duration: 30,
    type: 'checkup',
    status: 'confirmed',
    notes: 'Regular 6-month checkup',
  },
  {
    id: 'a2',
    patientId: '2',
    patientName: 'Michael Chen',
    date: today,
    time: '10:30',
    duration: 60,
    type: 'procedure',
    status: 'scheduled',
    notes: 'Wisdom teeth consultation follow-up',
  },
  {
    id: 'a3',
    patientId: '3',
    patientName: 'Emily Rodriguez',
    date: today,
    time: '14:00',
    duration: 45,
    type: 'cleaning',
    status: 'confirmed',
    notes: 'Deep cleaning session 1',
  },
  {
    id: 'a4',
    patientId: '4',
    patientName: 'David Thompson',
    date: addDays(today, 1),
    time: '11:00',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    notes: 'Initial consultation - new patient',
  },
  {
    id: 'a5',
    patientId: '5',
    patientName: 'Lisa Martinez',
    date: addDays(today, 2),
    time: '15:30',
    duration: 30,
    type: 'follow-up',
    status: 'scheduled',
    notes: 'Braces adjustment check',
  },
  {
    id: 'a6',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: addDays(today, 5),
    time: '09:30',
    duration: 60,
    type: 'procedure',
    status: 'scheduled',
    notes: 'Crown placement',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Upcoming Appointment',
    message: 'Sarah Johnson has an appointment tomorrow at 9:00 AM',
    type: 'appointment',
    read: false,
    createdAt: new Date(),
  },
  {
    id: 'n2',
    title: 'Reminder',
    message: 'Follow up with Emily Rodriguez regarding gum treatment',
    type: 'reminder',
    read: false,
    createdAt: subDays(new Date(), 1),
  },
  {
    id: 'n3',
    title: 'New Patient Registration',
    message: 'David Thompson has completed their registration',
    type: 'info',
    read: true,
    createdAt: subDays(new Date(), 2),
  },
  {
    id: 'n4',
    title: 'Cancelled Appointment',
    message: 'John Doe cancelled their appointment for next week',
    type: 'alert',
    read: true,
    createdAt: subDays(new Date(), 3),
  },
];

export const mockDashboardStats: DashboardStats = {
  todayAppointments: 3,
  weekAppointments: 12,
  totalPatients: 156,
  pendingFollowUps: 8,
};
