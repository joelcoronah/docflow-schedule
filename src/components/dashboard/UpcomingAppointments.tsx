import { format } from 'date-fns';
import { Clock, User, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
  return (
    <div className="rounded-lg sm:rounded-xl border border-border bg-card p-4 sm:p-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">{t('dashboard.todaySchedule')}</h2>
        <span className="text-xs sm:text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d')}</span>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {appointments.length === 0 ? (
          <p className="text-center text-sm sm:text-base text-muted-foreground py-6 sm:py-8">{t('dashboard.noAppointments')}</p>
        ) : (
          appointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className="flex items-center gap-2 sm:gap-3 md:gap-4 rounded-lg border border-border bg-background p-3 sm:p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 text-xl sm:text-2xl shrink-0">
                {typeIcons[appointment.type]}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm sm:text-base font-medium text-foreground truncate">{appointment.patientName}</p>
                  <Badge variant="outline" className={cn('text-xs whitespace-nowrap', statusColors[appointment.status])}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {appointment.time}
                  </span>
                  <span className="capitalize hidden sm:inline">{appointment.type}</span>
                  <span className="hidden sm:inline">{appointment.duration} min</span>
                </div>
              </div>

              <button className="rounded-lg p-1.5 sm:p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
