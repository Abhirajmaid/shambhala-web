import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

function loadEnvFile(path) {
  try {
    const contents = readFileSync(path, 'utf8');
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^([^#=\s]+)=(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      process.env[key] ||= rawValue.replace(/^["']|["']$/g, '');
    }
  } catch {
    // The script can still run when env vars are provided by the shell.
  }
}

loadEnvFile(resolve(process.cwd(), '.env.local'));

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const seedProjects = [
  {
    id: 'kitchen-01',
    name: 'Kitchen',
    category: 'Kitchen',
    tagline: 'Modular kitchens, built for how you actually cook.',
    status: 'Published',
    images: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/seed/kitchen-${i}/640/420`),
  },
  {
    id: 'wardrobe-01',
    name: 'Wardrobe',
    category: 'Wardrobe',
    tagline: 'Storage that disappears into the room.',
    status: 'Published',
    images: Array.from({ length: 16 }, (_, i) => `https://picsum.photos/seed/wardrobe-${i}/640/420`),
  },
  {
    id: 'bedroom-01',
    name: 'Bedroom',
    category: 'Bedroom',
    tagline: 'Beds and case goods for every footprint.',
    status: 'Published',
    images: Array.from({ length: 18 }, (_, i) => `https://picsum.photos/seed/bedroom-${i}/640/420`),
  },
  {
    id: 'living-01',
    name: 'Living Room',
    category: 'Living Room',
    tagline: 'Entertainment walls and storage that keep the room composed.',
    status: 'Published',
    images: Array.from({ length: 18 }, (_, i) => `https://picsum.photos/seed/living-${i}/640/420`),
  },
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

for (const project of seedProjects) {
  const { id, ...data } = project;
  await setDoc(doc(db, 'projects', id), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  console.log(`Seeded projects/${id}`);
}
