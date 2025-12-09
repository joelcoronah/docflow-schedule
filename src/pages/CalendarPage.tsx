import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppointmentForm, AppointmentFormData } from '@/components/appointments/AppointmentForm';
import { mockAppointments, mockPatients } from '@/data/mockData';
import { Appointment } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors = {
  scheduled: 'bg-warning text-warning-foreground',
  confirmed: 'bg-success text-success-foreground',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
  'no-show': 'bg-destructive text-destructive-foreground',
};

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(a => isSameDay(a.date, date));
  };

  const handleNewAppointment = (data: AppointmentFormData) => {
    const patient = mockPatients.find(p => p.id === data.patientId);
    if (!patient) return;

    const newAppointment: Appointment = {
      id: `a${Date.now()}`,
      patientId: data.patientId,
      patientName: patient.name,
      date: data.date,
      time: data.time,
      duration: data.duration,
      type: data.type,
      status: 'scheduled',
      notes: data.notes,
    };

    setAppointments([...appointments, newAppointment]);
    setShowNewAppointment(false);
    toast.success('Appointment scheduled successfully');
  };

  const selectedDayAppointments = selectedDate ? getAppointmentsForDay(selectedDate) : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">Manage your appointments and schedule</p>
          </div>
          <Button onClick={() => setShowNewAppointment(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 animate-slide-up">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {days.map((day) => {
                const dayAppointments = getAppointmentsForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'aspect-square rounded-lg p-1 text-sm transition-all duration-200 hover:bg-muted relative',
                      !isSameMonth(day, currentMonth) && 'text-muted-foreground/50',
                      isToday(day) && 'bg-primary/10 font-semibold text-primary',
                      isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                    )}
                  >
                    <span className="block">{format(day, 'd')}</span>
                    {dayAppointments.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayAppointments.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              isSelected ? 'bg-primary-foreground' : 'bg-primary'
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Details */}
          <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
            </h3>

            {selectedDate && (
              <div className="space-y-3">
                {selectedDayAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4 text-center">
                    No appointments scheduled
                  </p>
                ) : (
                  selectedDayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-lg border border-border bg-background p-4 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-foreground">{apt.patientName}</p>
                          <p className="text-sm text-muted-foreground">{apt.time} • {apt.duration} min</p>
                        </div>
                        <Badge className={statusColors[apt.status]}>
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 capitalize">{apt.type}</p>
                    </div>
                  ))
                )}

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setShowNewAppointment(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Appointment
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            patients={mockPatients}
            onSubmit={handleNewAppointment}
            onCancel={() => setShowNewAppointment(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CalendarPage;
