'use client';

import { EmployeeEquipmentTable } from '@/components/staff/EmployeeEquipmentTable';

export default function StaffPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Equipment</h1>
        <p className="text-gray-500 mt-1">
          Manage equipment assignments and track collection status
        </p>
      </div>

      {/* Equipment Table */}
      <EmployeeEquipmentTable />
    </div>
  );
}
