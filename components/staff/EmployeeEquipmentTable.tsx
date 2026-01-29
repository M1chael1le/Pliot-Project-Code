'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { EquipmentTypeSelect } from './EquipmentTypeSelect';
import { StatusSelect } from './StatusSelect';
import { CollectionModal } from '@/components/collection/CollectionModal';
import { useEquipment } from '@/context/EquipmentContext';
import { useToast } from '@/components/ui/Toast';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { mockUsers, getUserById } from '@/lib/mock-data';
import { Equipment, EquipmentStatus, EquipmentType, ADUser } from '@/types';
import { User, Package, Building2, Mail } from 'lucide-react';

interface EquipmentWithUser extends Equipment {
  user: ADUser | undefined;
}

export function EmployeeEquipmentTable() {
  const { equipment, updateEquipmentStatus, updateEquipmentType } = useEquipment();
  const { addToast } = useToast();
  const currentUser = useCurrentUser();

  const [collectionModal, setCollectionModal] = useState<{
    isOpen: boolean;
    equipmentId: string | null;
    pendingStatus: EquipmentStatus | null;
  }>({ isOpen: false, equipmentId: null, pendingStatus: null });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<EquipmentStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<EquipmentType | 'all'>('all');

  // Join equipment with users
  const equipmentWithUsers: EquipmentWithUser[] = useMemo(() => {
    return equipment.map((eq) => ({
      ...eq,
      user: getUserById(eq.assignedToUserId),
    }));
  }, [equipment]);

  // Filter and search
  const filteredEquipment = useMemo(() => {
    return equipmentWithUsers.filter((eq) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesUser =
          eq.user?.displayName.toLowerCase().includes(search) ||
          eq.user?.email.toLowerCase().includes(search);
        const matchesAsset =
          eq.assetTag.toLowerCase().includes(search) ||
          eq.make.toLowerCase().includes(search) ||
          eq.model.toLowerCase().includes(search);
        if (!matchesUser && !matchesAsset) return false;
      }

      // Status filter
      if (filterStatus !== 'all' && eq.status !== filterStatus) return false;

      // Type filter
      if (filterType !== 'all' && eq.type !== filterType) return false;

      return true;
    });
  }, [equipmentWithUsers, searchTerm, filterStatus, filterType]);

  // Handle status change
  const handleStatusChange = (equipmentId: string, newStatus: EquipmentStatus) => {
    const eq = equipment.find((e) => e.id === equipmentId);
    if (!eq) return;

    // If changing to 'returned', show confirmation modal
    if (newStatus === 'returned') {
      setCollectionModal({
        isOpen: true,
        equipmentId,
        pendingStatus: newStatus,
      });
    } else {
      // For other status changes, update directly
      updateEquipmentStatus(equipmentId, newStatus, currentUser.id);
      if (newStatus === 'pending') {
        addToast('info', 'Equipment marked as pending return. IT has been notified.');
      } else {
        addToast('success', 'Equipment status updated.');
      }
    }
  };

  // Handle type change
  const handleTypeChange = (equipmentId: string, newType: EquipmentType) => {
    updateEquipmentType(equipmentId, newType);
    addToast('success', 'Equipment type updated.');
  };

  // Confirm collection
  const handleConfirmCollection = () => {
    if (collectionModal.equipmentId && collectionModal.pendingStatus) {
      updateEquipmentStatus(
        collectionModal.equipmentId,
        collectionModal.pendingStatus,
        currentUser.id
      );
      addToast('success', 'Equipment marked as returned. IT has been notified.');
    }
    setCollectionModal({ isOpen: false, equipmentId: null, pendingStatus: null });
  };

  const selectedEquipment = collectionModal.equipmentId
    ? equipment.find((eq) => eq.id === collectionModal.equipmentId)
    : null;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name, email, or asset tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as EquipmentStatus | 'all')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="assigned">Assigned</option>
            <option value="pending">Pending</option>
            <option value="returned">Returned</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as EquipmentType | 'all')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="laptop">Laptop</option>
            <option value="desktop">Desktop</option>
            <option value="monitor">Monitor</option>
            <option value="keyboard">Keyboard</option>
            <option value="mouse">Mouse</option>
            <option value="headset">Headset</option>
            <option value="phone">Phone</option>
            <option value="tablet">Tablet</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {filteredEquipment.length} of {equipment.length} items
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Employee</TableHead>
              <TableHead className="w-[200px]">Asset</TableHead>
              <TableHead className="w-[150px]">Equipment Type</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  No equipment found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredEquipment.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {eq.user ? (
                          <span className="text-sm font-medium text-gray-600">
                            {eq.user.displayName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {eq.user?.displayName || 'Unknown User'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Building2 className="h-3 w-3" />
                          {eq.user?.department || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{eq.assetTag}</p>
                      <p className="text-xs text-gray-500">
                        {eq.make} {eq.model}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <EquipmentTypeSelect
                      value={eq.type}
                      onChange={(type) => handleTypeChange(eq.id, type)}
                      disabled={eq.status === 'returned'}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusSelect
                      value={eq.status}
                      onChange={(status) => handleStatusChange(eq.id, status)}
                      disabled={eq.status === 'returned'}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Collection Modal */}
      <CollectionModal
        isOpen={collectionModal.isOpen}
        onClose={() =>
          setCollectionModal({ isOpen: false, equipmentId: null, pendingStatus: null })
        }
        onConfirm={handleConfirmCollection}
        equipment={selectedEquipment}
      />
    </div>
  );
}
