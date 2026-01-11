import { useState, useEffect } from 'react';
import { format, startOfDay, isBefore } from 'date-fns';
import { CalendarIcon, Clock, User, FileText, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Patient, AppointmentType } from '@/types';
import { PatientForm, PatientFormData } from '@/components/patients/PatientForm';
import { toast } from 'sonner';

interface AppointmentFormProps {
  patients: Patient[];
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  onPatientCreated?: (patient: Patient) => void;
  initialDate?: Date; // Pre-selected date from calendar
  initialData?: Partial<AppointmentFormData>; // Pre-fill form data for editing
  disablePastDates?: boolean; // Block dates before today
  isEditing?: boolean; // Hide "Register New Patient" button in edit mode
}

export interface AppointmentFormData {
  patientId: string;
  date: Date;
  time: string;
  duration: number;
  type: AppointmentType;
  notes: string;
}

const appointmentTypes: { value: AppointmentType; label: string }[] = [
  { value: 'checkup', label: 'Regular Checkup' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'follow-up', label: 'Follow-up' },
];

const timeSlots = Array.from({ length: 20 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export function AppointmentForm({ 
  patients, 
  onSubmit, 
  onCancel, 
  onPatientCreated,
  initialDate,
  initialData,
  disablePastDates = false,
  isEditing = false,
}: AppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(initialData?.date);
  const [patientId, setPatientId] = useState(initialData?.patientId || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [duration, setDuration] = useState(initialData?.duration?.toString() || '30');
  const [type, setType] = useState<AppointmentType>(initialData?.type || 'checkup');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to control calendar popover

  // Update form fields when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setPatientId(initialData.patientId || '');
      setTime(initialData.time || '');
      setDuration(initialData.duration?.toString() || '30');
      setType(initialData.type || 'checkup');
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  // Set initial date if provided (from calendar)
  useEffect(() => {
    if (initialDate && !initialData?.date) {
      setDate(initialDate);
    }
  }, [initialDate, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit({
      patientId,
      date,
      time,
      duration: parseInt(duration),
      type,
      notes,
    });
  };

  // Handle date selection and close calendar
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsCalendarOpen(false); // Close calendar after selection
  };

  // Handle new patient creation
  const handlePatientCreated = (patientData: PatientFormData) => {
    // Create a new patient object with all required fields
    const newPatient: Patient = {
      id: `p${Date.now()}`,
      name: patientData.name,
      email: patientData.email,
      phone: patientData.phone,
      dateOfBirth: patientData.dateOfBirth,
      address: patientData.address,
      createdAt: new Date(),
      notes: patientData.notes,
      medicalHistory: [],
    };

    // Notify parent component about the new patient
    if (onPatientCreated) {
      onPatientCreated(newPatient);
    }

    // Select the newly created patient
    setPatientId(newPatient.id);
    
    // Close the patient registration dialog
    setShowPatientDialog(false);
    
    // Show success message
    toast.success('Patient registered successfully');
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="patient">Patient *</Label>
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPatientDialog(true)}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Register New Patient
              </Button>
            )}
          </div>
          <Select 
            key={`patient-${patientId}`} 
            value={patientId} 
            onValueChange={setPatientId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={
                    disablePastDates
                      ? (date) => isBefore(startOfDay(date), startOfDay(new Date()))
                      : undefined
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Select 
              key={`time-${time}`} 
              value={time} 
              onValueChange={setTime}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Select 
              key={`type-${type}`} 
              value={type} 
              onValueChange={(v) => setType(v as AppointmentType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select 
              key={`duration-${duration}`} 
              value={duration} 
              onValueChange={setDuration}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
                <SelectItem value="90">90 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any relevant notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Schedule Appointment</Button>
      </div>
    </form>

    {/* New Patient Registration Dialog */}
    <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
        </DialogHeader>
        <PatientForm
          onSubmit={handlePatientCreated}
          onCancel={() => setShowPatientDialog(false)}
        />
      </DialogContent>
    </Dialog>
    </>
  );
}
