import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Initiates the Google Sign-In popup flow.
 * @returns {Promise<User>} The authenticated Firebase User.
 */
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

/**
 * Syncs the authenticated user's profile to the 'users' collection in Firestore.
 * This ensures they have a staff record for equipment assignment tracking.
 * @param {User} user The authenticated Firebase User.
 * @param {string} role The role selected at login ('manager' or 'it').
 */
export const syncUserToFirestore = async (user, role) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);

    try {
        const userDoc = await getDoc(userRef);

        // If user doesn't exist, create them. If they do, update their last login.
        if (!userDoc.exists()) {
            await setDoc(userRef, {
                displayName: user.displayName || user.email.split('@')[0],
                email: user.email,
                photoURL: user.photoURL || '',
                // In a real app, manager_id might be set via an admin panel. 
                // For the demo, we'll map their own email if manager, else blank
                manager_id: role === 'manager' ? user.email : '',
                employee_id: user.uid, // Using Firebase UID as employee ID for simplicity
                role: role,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
            });
        } else {
            await setDoc(userRef, {
                lastLoginAt: serverTimestamp(),
                // Keep their assigned role updated based on their latest login selection for testing
                role: role,
                // Sync photo/name in case they changed it on Google
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL || '',
            }, { merge: true });
        }

        return true;
    } catch (error) {
        console.error('Error syncing user to Firestore:', error);
        throw error;
    }
};
