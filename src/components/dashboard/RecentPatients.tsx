import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Patient } from "@/types";
import { Link } from "react-router-dom";
import { parseDateFromAPI } from "@/lib/date-utils";

interface RecentPatientsProps {
  patients: Patient[];
}

export function RecentPatients({ patients }: RecentPatientsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="rounded-lg sm:rounded-xl border border-border bg-card p-4 sm:p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          {t('dashboard.recentPatients')}
        </h2>
        <Link
          to="/patients"
          className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {t('common.viewAll')}
        </Link>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {patients.slice(0, 5).map((patient, index) => (
          <Link
            key={patient.id}
            to={`/patients/${patient.id}`}
            className="flex items-center gap-3 sm:gap-4 rounded-lg p-2.5 sm:p-3 transition-all duration-200 hover:bg-muted group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-xs sm:text-sm font-semibold text-primary shrink-0">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-medium text-foreground truncate">
                {patient.name}
              </p>
              {patient.createdAt && (
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {t('dashboard.lastVisit')}{" "}
                  {formatDistanceToNow(parseDateFromAPI(patient.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>

            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
