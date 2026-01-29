'use client';

import { CheckCircle } from 'lucide-react';
import { Equipment, EQUIPMENT_TYPE_LABELS } from '@/types';
import { getUserById } from '@/lib/mock-data';

interface CollectionConfirmationProps {
  equipment: Equipment;
}

export function CollectionConfirmation({ equipment }: CollectionConfirmationProps) {
  const user = getUserById(equipment.assignedToUserId);

  return (
    <div className="text-center py-4">
      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Equipment Collected Successfully
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {EQUIPMENT_TYPE_LABELS[equipment.type]} ({equipment.assetTag}) has been marked as
        returned from {user?.displayName || 'Unknown User'}.
      </p>
      <p className="text-sm text-blue-600">
        IT has been notified about this collection.
      </p>
    </div>
  );
}
