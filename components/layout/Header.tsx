'use client';

import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEquipment } from '@/context/EquipmentContext';

export function Header() {
  const { currentUser, role } = useAuth();
  const { alerts } = useEquipment();
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  if (!currentUser) {
    return null;
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search staff or equipment..."
          className="w-80 pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Role Indicator */}
        {role === 'it' && (
          <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
            IT View
          </span>
        )}
        {role === 'manager' && (
          <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Manager View
          </span>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="h-5 w-5" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {currentUser.displayName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{currentUser.displayName}</p>
            <p className="text-gray-500 text-xs">{currentUser.title}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
