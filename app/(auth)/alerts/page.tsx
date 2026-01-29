'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useEquipment } from '@/context/EquipmentContext';
import { getUserById } from '@/lib/mock-data';
import { ITAlert } from '@/types';
import {
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Check,
  Trash2,
  Package,
} from 'lucide-react';

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const alertTypeIcons: Record<ITAlert['type'], typeof Bell> = {
  collection: CheckCircle,
  pending_return: Clock,
  overdue: AlertTriangle,
};

const alertTypeBadgeVariants: Record<ITAlert['type'], 'green' | 'yellow' | 'red'> = {
  collection: 'green',
  pending_return: 'yellow',
  overdue: 'red',
};

const alertTypeLabels: Record<ITAlert['type'], string> = {
  collection: 'Collection',
  pending_return: 'Pending Return',
  overdue: 'Overdue',
};

export default function AlertsPage() {
  const { alerts, markAlertAsRead } = useEquipment();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'read') return alert.read;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const handleMarkAllRead = () => {
    alerts.filter((a) => !a.read).forEach((a) => markAlertAsRead(a.id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IT Alerts</h1>
          <p className="text-gray-500 mt-1">
            Equipment collection notifications and pending returns
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-gray-300" onClick={() => setFilter('all')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{alerts.length}</p>
              <p className="text-sm text-gray-500">Total Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-gray-300" onClick={() => setFilter('unread')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{unreadCount}</p>
              <p className="text-sm text-gray-500">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-gray-300" onClick={() => setFilter('read')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {alerts.length - unreadCount}
              </p>
              <p className="text-sm text-gray-500">Read</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'unread'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'read'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Read ({alerts.length - unreadCount})
        </button>
      </div>

      {/* Alerts List */}
      <Card>
        <CardContent className="p-0">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No alerts to display</p>
              <p className="text-sm mt-1">
                {filter === 'unread'
                  ? 'All alerts have been read'
                  : filter === 'read'
                  ? 'No read alerts yet'
                  : 'No alerts have been generated yet'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredAlerts.map((alert) => {
                const Icon = alertTypeIcons[alert.type];
                const user = getUserById(alert.userId);

                return (
                  <li
                    key={alert.id}
                    className={`p-4 flex items-start gap-4 ${
                      !alert.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        alert.type === 'collection'
                          ? 'bg-green-100'
                          : alert.type === 'pending_return'
                          ? 'bg-yellow-100'
                          : 'bg-red-100'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          alert.type === 'collection'
                            ? 'text-green-600'
                            : alert.type === 'pending_return'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={alertTypeBadgeVariants[alert.type]}>
                          {alertTypeLabels[alert.type]}
                        </Badge>
                        {!alert.read && (
                          <Badge variant="blue" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(alert.createdAt)}
                      </p>
                    </div>
                    {!alert.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
