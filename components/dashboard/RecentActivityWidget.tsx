'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useEquipment } from '@/context/EquipmentContext';
import { getUserById } from '@/lib/mock-data';
import { Activity, ArrowRight, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ActivityLogEntry } from '@/types';

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

const typeIcons: Record<ActivityLogEntry['type'], typeof CheckCircle> = {
  collection: CheckCircle,
  status_change: RefreshCw,
  assignment: ArrowRight,
  alert: AlertCircle,
};

const typeBadgeVariants: Record<ActivityLogEntry['type'], 'green' | 'blue' | 'yellow' | 'red'> = {
  collection: 'green',
  status_change: 'blue',
  assignment: 'blue',
  alert: 'yellow',
};

export function RecentActivityWidget() {
  const { activityLog } = useEquipment();
  const recentActivity = activityLog.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {recentActivity.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No recent activity</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => {
              const Icon = typeIcons[activity.type];
              const performer = activity.performedBy === 'system'
                ? 'System'
                : getUserById(activity.performedBy)?.displayName || 'Unknown';

              return (
                <li key={activity.id} className="px-6 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={typeBadgeVariants[activity.type]} className="text-xs">
                          {activity.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          by {performer} - {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
