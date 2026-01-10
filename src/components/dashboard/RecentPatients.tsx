import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Patient } from "@/types";
import { Link } from "react-router-dom";
import { parseDateFromAPI } from "@/lib/date-utils";

interface RecentPatientsProps {
  patients: Patient[];
}

export function RecentPatients({ patients }: RecentPatientsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Patients
        </h2>
        <Link
          to="/patients"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {patients.slice(0, 5).map((patient, index) => (
          <Link
            key={patient.id}
            to={`/patients/${patient.id}`}
            className="flex items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:bg-muted group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {patient.name}
              </p>
              {patient.createdAt && (
                <p className="text-sm text-muted-foreground">
                  Last visit{" "}
                  {formatDistanceToNow(parseDateFromAPI(patient.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
