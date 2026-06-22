import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function listenToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export function signInAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export function signOutAdmin() {
  return signOut(auth);
}
