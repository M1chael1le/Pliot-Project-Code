'use client';

import { LayoutDashboard, Users, Bell, Settings, LogOut } from 'lucide-react';
import { NavItem } from './NavItem';
import { useEquipment } from '@/context/EquipmentContext';

export function Sidebar() {
  const { alerts } = useEquipment();
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SH</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">Seven Hills</h1>
            <p className="text-xs text-gray-500">Equipment Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/staff" icon={Users} label="Staff Equipment" />
        <NavItem href="/alerts" icon={Bell} label="IT Alerts" badge={unreadAlerts} />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <NavItem href="/settings" icon={Settings} label="Settings" />
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors">
          <LogOut className="h-5 w-5 text-gray-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
