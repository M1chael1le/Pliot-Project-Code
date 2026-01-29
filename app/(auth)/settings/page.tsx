'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Application configuration and preferences
        </p>
      </div>

      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Settings Coming Soon
          </h3>
          <p className="text-sm">
            Configuration options will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
