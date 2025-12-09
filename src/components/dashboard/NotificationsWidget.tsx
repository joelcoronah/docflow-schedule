import { formatDistanceToNow } from 'date-fns';
import { Bell, Calendar, AlertCircle, Info } from 'lucide-react';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface NotificationsWidgetProps {
  notifications: Notification[];
}

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

export function NotificationsWidget({ notifications }: NotificationsWidgetProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <Link to="/notifications" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {notifications.slice(0, 4).map((notification, index) => {
          const Icon = iconMap[notification.type];
          return (
            <div
              key={notification.id}
              className={cn(
                'flex items-start gap-3 rounded-lg p-3 transition-all duration-200',
                !notification.read ? 'bg-primary/5' : 'hover:bg-muted'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn('rounded-lg p-2', colorMap[notification.type])}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm truncate',
                  !notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}>
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                </p>
              </div>

              {!notification.read && (
                <div className="h-2 w-2 rounded-full bg-primary mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
