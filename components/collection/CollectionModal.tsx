'use client';

import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Equipment, EQUIPMENT_TYPE_LABELS } from '@/types';
import { getUserById } from '@/lib/mock-data';
import { AlertTriangle, Package, User } from 'lucide-react';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  equipment: Equipment | null | undefined;
}

export function CollectionModal({
  isOpen,
  onClose,
  onConfirm,
  equipment,
}: CollectionModalProps) {
  if (!equipment) return null;

  const user = getUserById(equipment.assignedToUserId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Equipment Collection"
      size="md"
    >
      <div className="space-y-4">
        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Confirm Equipment Collection
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              This will mark the equipment as returned and notify IT for inventory update.
            </p>
          </div>
        </div>

        {/* Equipment Details */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <Package className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {EQUIPMENT_TYPE_LABELS[equipment.type]}
              </p>
              <p className="text-sm text-gray-500">
                {equipment.make} {equipment.model}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">Asset Tag</span>
            <Badge variant="gray">{equipment.assetTag}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Assigned To</span>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {user?.displayName || 'Unknown User'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Current Status</span>
            <Badge
              variant={
                equipment.status === 'assigned'
                  ? 'blue'
                  : equipment.status === 'pending'
                  ? 'yellow'
                  : 'green'
              }
            >
              {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      <ModalFooter className="-mx-6 -mb-4 mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          Confirm Collection
        </Button>
      </ModalFooter>
    </Modal>
  );
}
