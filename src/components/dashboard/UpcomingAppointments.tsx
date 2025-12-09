import { format } from 'date-fns';
import { Clock, User, MoreVertical } from 'lucide-react';
import { Appointment } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

const statusColors = {
  scheduled: 'bg-warning/10 text-warning border-warning/20',
  confirmed: 'bg-success/10 text-success border-success/20',
  completed: 'bg-muted text-muted-foreground border-muted',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  'no-show': 'bg-destructive/10 text-destructive border-destructive/20',
};

const typeIcons = {
  checkup: '🦷',
  cleaning: '✨',
  procedure: '🔧',
  consultation: '💬',
  emergency: '🚨',
  'follow-up': '📋',
};

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Today's Schedule</h2>
        <span className="text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d')}</span>
      </div>
      
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No appointments scheduled for today</p>
        ) : (
          appointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {typeIcons[appointment.type]}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">{appointment.patientName}</p>
                  <Badge variant="outline" className={cn('text-xs', statusColors[appointment.status])}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {appointment.time}
                  </span>
                  <span className="capitalize">{appointment.type}</span>
                  <span>{appointment.duration} min</span>
                </div>
              </div>

              <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
