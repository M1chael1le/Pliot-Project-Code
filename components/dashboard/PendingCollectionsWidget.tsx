'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useEquipment } from '@/context/EquipmentContext';
import { getUserById } from '@/lib/mock-data';
import { EQUIPMENT_TYPE_LABELS } from '@/types';
import { Clock, Package } from 'lucide-react';

interface PendingCollectionsWidgetProps {
  onMarkCollected?: (equipmentId: string) => void;
}

export function PendingCollectionsWidget({ onMarkCollected }: PendingCollectionsWidgetProps) {
  const { getPendingEquipment } = useEquipment();
  const pendingEquipment = getPendingEquipment();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          Pending Collections
        </CardTitle>
        <Badge variant="yellow">{pendingEquipment.length} items</Badge>
      </CardHeader>
      <CardContent className="p-0">
        {pendingEquipment.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No pending collections</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pendingEquipment.slice(0, 5).map((eq) => {
              const user = getUserById(eq.assignedToUserId);
              return (
                <li key={eq.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.displayName || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {EQUIPMENT_TYPE_LABELS[eq.type]} - {eq.assetTag}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkCollected?.(eq.id)}
                  >
                    Mark Collected
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
        {pendingEquipment.length > 5 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              +{pendingEquipment.length - 5} more items
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
