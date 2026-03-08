import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App;

if (!getApps().length) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountPath) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceAccount = require(serviceAccountPath);
    app = initializeApp({ credential: cert(serviceAccount) });
  } else {
    // Fall back to application default credentials
    app = initializeApp();
  }
} else {
  app = getApps()[0];
}

export const adminDb: Firestore = getFirestore(app);
