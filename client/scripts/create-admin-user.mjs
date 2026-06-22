import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

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

const [emailArg, passwordArg] = process.argv.slice(2);
const email = emailArg || process.env.ADMIN_EMAIL;
const password = passwordArg || process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Usage: npm run create:admin -- <email> <password>');
  console.error('Example: npm run create:admin -- admin@shambhalahome.com shambhala123');
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  console.log(`Created Firebase Auth user: ${credential.user.email}`);
} catch (error) {
  if (error.code === 'auth/email-already-in-use') {
    console.log(`Firebase Auth user already exists: ${email}`);
    process.exit(0);
  }

  console.error(`Unable to create Firebase Auth user: ${error.message}`);
  process.exit(1);
}
