import { formatDistanceToNow } from 'date-fns';
import { Bell, Calendar, AlertCircle, Info, Check, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';
import { parseDateFromAPI } from '@/lib/date-utils';
import { toast } from 'sonner';

const iconMap = {
  appointment: Calendar,
  reminder: Bell,
  alert: AlertCircle,
  info: Info,
};

const colorMap = {
  appointment: 'bg-primary/10 text-primary',
  reminder: 'bg-warning/10 text-warning',
  alert: 'bg-destructive/10 text-destructive',
  info: 'bg-muted text-muted-foreground',
};

const NotificationsPage = () => {
  const { data: notificationsData, isLoading } = useNotifications({ limit: 100 });
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      toast.error('Failed to mark notification as read');
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
      console.error(error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(id);
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading notifications...</div>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && (
          <div className="space-y-3 animate-slide-up">
            {notifications.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
            notifications.map((notification, index) => {
              const Icon = iconMap[notification.type];
              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-4 rounded-xl border bg-card p-5 transition-all duration-200',
                    !notification.read ? 'border-primary/20 bg-primary/5' : 'border-border hover:border-muted-foreground/20'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn('rounded-xl p-3 shrink-0', colorMap[notification.type])}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={cn(
                          'font-medium',
                          !notification.read ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-2">
                          {formatDistanceToNow(parseDateFromAPI(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
