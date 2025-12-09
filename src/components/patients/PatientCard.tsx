import { format } from 'date-fns';
import { Mail, Phone, Calendar, ChevronRight } from 'lucide-react';
import { Patient } from '@/types';
import { Link } from 'react-router-dom';

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <Link
      to={`/patients/${patient.id}`}
      className="block rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg group"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary shrink-0">
          {patient.name.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground truncate">{patient.name}</h3>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </div>
          
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{patient.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>DOB: {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {patient.notes && (
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2 border-t border-border pt-4">
          {patient.notes}
        </p>
      )}
    </Link>
  );
}
