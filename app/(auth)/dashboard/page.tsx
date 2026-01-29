'use client';

import { useState } from 'react';
import { Users, Clock, Bell, CheckCircle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { PendingCollectionsWidget } from '@/components/dashboard/PendingCollectionsWidget';
import { RecentActivityWidget } from '@/components/dashboard/RecentActivityWidget';
import { CollectionModal } from '@/components/collection/CollectionModal';
import { useEquipment } from '@/context/EquipmentContext';
import { useToast } from '@/components/ui/Toast';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function DashboardPage() {
  const { stats, equipment, updateEquipmentStatus } = useEquipment();
  const { addToast } = useToast();
  const currentUser = useCurrentUser();

  const [collectionModal, setCollectionModal] = useState<{
    isOpen: boolean;
    equipmentId: string | null;
  }>({ isOpen: false, equipmentId: null });

  const handleMarkCollected = (equipmentId: string) => {
    setCollectionModal({ isOpen: true, equipmentId });
  };

  const handleConfirmCollection = () => {
    if (collectionModal.equipmentId) {
      updateEquipmentStatus(collectionModal.equipmentId, 'returned', currentUser.id);
      addToast('success', 'Equipment marked as returned. IT has been notified.');
    }
    setCollectionModal({ isOpen: false, equipmentId: null });
  };

  const selectedEquipment = collectionModal.equipmentId
    ? equipment.find((eq) => eq.id === collectionModal.equipmentId)
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of equipment assignments and collections
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Staff"
          value={stats.totalStaff}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Pending Returns"
          value={stats.pendingReturns}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon={Bell}
          color="red"
        />
        <StatCard
          title="Collected This Week"
          value={stats.collectedThisWeek}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingCollectionsWidget onMarkCollected={handleMarkCollected} />
        <RecentActivityWidget />
      </div>

      {/* Collection Modal */}
      <CollectionModal
        isOpen={collectionModal.isOpen}
        onClose={() => setCollectionModal({ isOpen: false, equipmentId: null })}
        onConfirm={handleConfirmCollection}
        equipment={selectedEquipment}
      />
    </div>
  );
}
