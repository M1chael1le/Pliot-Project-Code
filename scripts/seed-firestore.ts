import * as path from 'path';
import * as fs from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { mockUsers } from '../lib/mock-data/users';
import { mockEquipment, mockCollectionRecords, mockActivityLog, mockITAlerts } from '../lib/mock-data/equipment';

// Resolve service account key relative to project root
const projectRoot = path.resolve(__dirname, '..');
const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  || './seven-hills-ba3ea-firebase-adminsdk-fbsvc-65c0f704b8.json';
const resolvedPath = path.resolve(projectRoot, SERVICE_ACCOUNT_PATH);
const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

async function seedCollection<T extends { id: string }>(
  collectionName: string,
  data: T[],
  idField: keyof T & string = 'id' as keyof T & string
) {
  const batch = db.batch();
  for (const item of data) {
    const docId = item[idField] as string;
    const ref = db.collection(collectionName).doc(docId);
    batch.set(ref, { ...item });
  }
  await batch.commit();
  console.log(`  ✓ ${collectionName}: ${data.length} documents`);
}

async function main() {
  console.log('Seeding Firestore...\n');

  await seedCollection('users', mockUsers);
  await seedCollection('equipment', mockEquipment);
  await seedCollection('collectionRecords', mockCollectionRecords);
  await seedCollection('activityLog', mockActivityLog);
  await seedCollection('itAlerts', mockITAlerts);

  console.log('\nDone! All collections seeded.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
