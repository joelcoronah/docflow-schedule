import { Calendar, Users, Clock, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { RecentPatients } from '@/components/dashboard/RecentPatients';
import { NotificationsWidget } from '@/components/dashboard/NotificationsWidget';
import { mockAppointments, mockPatients, mockNotifications, mockDashboardStats } from '@/data/mockData';
import { isSameDay } from 'date-fns';

const Index = () => {
  const todayAppointments = mockAppointments.filter(a => isSameDay(a.date, new Date()));

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Dr. Roberts. Here's your practice overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Appointments"
            value={mockDashboardStats.todayAppointments}
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title="This Week"
            value={mockDashboardStats.weekAppointments}
            icon={Clock}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Patients"
            value={mockDashboardStats.totalPatients}
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Pending Follow-ups"
            value={mockDashboardStats.pendingFollowUps}
            icon={AlertCircle}
            variant="accent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UpcomingAppointments appointments={todayAppointments} />
          </div>
          <div className="space-y-6">
            <NotificationsWidget notifications={mockNotifications} />
          </div>
        </div>

        {/* Recent Patients */}
        <RecentPatients patients={mockPatients} />
      </div>
    </MainLayout>
  );
};

export default Index;
