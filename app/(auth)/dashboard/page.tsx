'use client';

import { useState, useEffect } from 'react';
import { Users, Clock, Bell, CheckCircle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { PendingCollectionsWidget } from '@/components/dashboard/PendingCollectionsWidget';
import { RecentActivityWidget } from '@/components/dashboard/RecentActivityWidget';
import { CollectionModal } from '@/components/collection/CollectionModal';
import { useToast } from '@/components/ui/Toast';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// Firebase Services
import {
  getManagerScope,
  getEquipmentForStaff,
  processCollection,
} from '@/services/equipmentService';

export default function DashboardPage() {
  const { addToast } = useToast();
  const currentUser = useCurrentUser();

  // State for fetched Firebase data
  const [staffScope, setStaffScope] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats derived from fetched Firebase data
  const [stats, setStats] = useState({
    totalStaff: 0,
    pendingReturns: 0,
    activeAlerts: 0,
    collectedThisWeek: 0,
  });

  const [collectionModal, setCollectionModal] = useState<{
    isOpen: boolean;
    equipmentId: string | null;
  }>({ isOpen: false, equipmentId: null });

  // Load Initial Equipment Data Scoped to Manager
  const fetchDashboardData = async () => {
    // Assuming currentUser has an email
    if (!currentUser?.email) return;

    setIsLoadingData(true);
    try {
      const staff = await getManagerScope(currentUser.email);
      setStaffScope(staff);

      // Fetch all equipment for scoped staff
      // Requires each staff to have an employee_id
      const equipmentPromises = staff.map((s) => getEquipmentForStaff(s.employee_id));
      const equipmentResults = await Promise.all(equipmentPromises);

      const flattenedEquipment = equipmentResults.flat();
      setEquipmentList(flattenedEquipment);

      // Derive dummy logic stats based on fetched arrays
      setStats({
        totalStaff: staff.length,
        pendingReturns: flattenedEquipment.filter((eq) => eq.status !== 'COLLECTED').length,
        activeAlerts: 0, // Placeholder
        collectedThisWeek: flattenedEquipment.filter((eq) => eq.status === 'COLLECTED').length,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      addToast('error', 'Failed to load dashboard data. Please refresh.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleMarkCollected = (equipmentId: string) => {
    setCollectionModal({ isOpen: true, equipmentId });
  };

  const handleConfirmCollection = async (notes?: string) => {
    if (!collectionModal.equipmentId || !currentUser?.email) return;

    setIsSubmitting(true);
    try {
      // Execute atomic Firestore transaction
      const success = await processCollection(
        collectionModal.equipmentId,
        currentUser.email,
        notes || 'Marked as returned via User Portal'
      );

      if (success) {
        addToast('success', 'Equipment marked as returned. IT has been notified.');
        // Refresh the local data arrays
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Update Failed:', error);
      addToast('error', 'Update Failed: Please try again.');
    } finally {
      setIsSubmitting(false);
      setCollectionModal({ isOpen: false, equipmentId: null });
    }
  };

  const selectedEquipment = collectionModal.equipmentId
    ? equipmentList.find((eq) => eq.id === collectionModal.equipmentId)
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
          value={isLoadingData ? '...' : stats.totalStaff}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Pending Returns"
          value={isLoadingData ? '...' : stats.pendingReturns}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Active Alerts"
          value={isLoadingData ? '...' : stats.activeAlerts}
          icon={Bell}
          color="red"
        />
        <StatCard
          title="Collected This Week"
          value={isLoadingData ? '...' : stats.collectedThisWeek}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass down actual equipment list and handlers */}
        {/* You may need to wire this up inside PendingCollectionsWidget dependent on its props */}
        <PendingCollectionsWidget
          onMarkCollected={handleMarkCollected}
          equipmentList={equipmentList}
          isLoading={isLoadingData}
        />
        <RecentActivityWidget />
      </div>

      {/* Collection Modal */}
      {collectionModal.isOpen && (
        <CollectionModal
          isOpen={collectionModal.isOpen}
          onClose={() => !isSubmitting && setCollectionModal({ isOpen: false, equipmentId: null })}
          onConfirm={handleConfirmCollection}
          equipment={selectedEquipment}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
