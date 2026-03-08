import { db } from '../lib/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    runTransaction,
    doc,
    serverTimestamp,
} from 'firebase/firestore';

/**
 * Gets the users (staff) assigned to a specific manager.
 * @param {string} managerEmail The manager's email (manager_id).
 * @returns {Promise<Array>} List of user objects including employee_id.
 */
export const getManagerScope = async (managerEmail) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('manager_id', '==', managerEmail));
        const querySnapshot = await getDocs(q);

        const scope = [];
        querySnapshot.forEach((doc) => {
            scope.push({ id: doc.id, ...doc.data() });
        });

        return scope;
    } catch (error) {
        console.error('Error fetching manager scope:', error);
        throw error;
    }
};

/**
 * Gets the equipment assigned to a specific employee.
 * @param {string} employeeId The employee's ID.
 * @returns {Promise<Array>} List of equipment objects.
 */
export const getEquipmentForStaff = async (employeeId) => {
    try {
        const equipmentRef = collection(db, 'equipment');
        const q = query(equipmentRef, where('assigned_to_id', '==', employeeId));
        const querySnapshot = await getDocs(q);

        const equipmentList = [];
        querySnapshot.forEach((doc) => {
            equipmentList.push({ id: doc.id, ...doc.data() });
        });

        return equipmentList;
    } catch (error) {
        console.error(`Error fetching equipment for staff ${employeeId}:`, error);
        throw error;
    }
};

/**
 * Processes the collection of an equipment asset.
 * Uses a transaction to update equipment status and create a collection event.
 * @param {string} assetTag The asset tag to collect (used as document ID for equipment).
 * @param {string} managerId The ID/email of the manager collecting it.
 * @param {string} notes Any notes for the collection.
 */
export const processCollection = async (assetTag, managerId, notes) => {
    if (!assetTag || !managerId) {
        throw new Error('Asset Tag and Manager ID are required.');
    }

    try {
        const equipmentDocRef = doc(db, 'equipment', assetTag);
        // Use an auto-generated ID for the new event
        const newEventRef = doc(collection(db, 'collection_events'));

        await runTransaction(db, async (transaction) => {
            const equipDoc = await transaction.get(equipmentDocRef);
            if (!equipDoc.exists()) {
                throw new Error(`Equipment with asset tag ${assetTag} does not exist!`);
            }

            // Action A: Update equipment status
            transaction.update(equipmentDocRef, {
                status: 'COLLECTED',
            });

            // Action B: Create collection event
            transaction.set(newEventRef, {
                asset_tag: assetTag,
                collected_by: managerId,
                timestamp: serverTimestamp(),
                notes: notes || '',
                status: 'COLLECTED_PENDING_IT',
            });
        });

        return true; // Transaction successful
    } catch (error) {
        console.error('Transaction failed: ', error);
        throw error;
    }
};
