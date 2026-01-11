import { Calendar, Users, Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { NotificationsWidget } from "@/components/dashboard/NotificationsWidget";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useAppointments } from "@/hooks/use-appointments";
import { usePatients } from "@/hooks/use-patients";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDateForAPI } from "@/lib/date-utils";

const Index = () => {
  const { t } = useTranslation();
  const today = formatDateForAPI(new Date());

  // Fetch data using React Query hooks
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: appointmentsData, isLoading: appointmentsLoading } =
    useAppointments({
      date: today,
      limit: 10,
    });
  const { data: patientsData, isLoading: patientsLoading } = usePatients({
    limit: 5,
  });
  const { data: notificationsData, isLoading: notificationsLoading } =
    useNotifications({
      limit: 5,
    });

  const todayAppointments = appointmentsData?.data || [];
  const recentPatients = patientsData?.data || [];
  const notifications = notificationsData?.data || [];
  const stats = statsData || {
    todayAppointments: 0,
    weekAppointments: 0,
    totalPatients: 0,
    pendingFollowUps: 0,
  };

  const isLoading =
    statsLoading ||
    appointmentsLoading ||
    patientsLoading ||
    notificationsLoading;

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {t('dashboard.welcome')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title={t('dashboard.todayAppointments')}
            value={stats.todayAppointments}
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title={t('dashboard.thisWeek')}
            value={stats.weekAppointments}
            icon={Clock}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title={t('dashboard.totalPatients')}
            value={stats.totalPatients}
            icon={Users}
            variant="success"
          />
          <StatsCard
            title={t('dashboard.pendingFollowUps')}
            value={stats.pendingFollowUps}
            icon={AlertCircle}
            variant="accent"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">
              {t('dashboard.loadingData')}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        {!isLoading && (
          <>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <UpcomingAppointments appointments={todayAppointments} />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <NotificationsWidget notifications={notifications} />
              </div>
            </div>

            {/* Recent Patients */}
            <RecentPatients patients={recentPatients} />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
