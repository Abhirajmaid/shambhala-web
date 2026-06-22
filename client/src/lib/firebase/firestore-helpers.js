import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function serializeDoc(snapshot) {
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

/**
 * @template T
 * @param {string} collectionName
 * @param {{publishedOnly?: boolean, pageSize?: number, orderField?: string, cursor?: unknown}} [options]
 * @returns {Promise<{items: T[], cursor: unknown}>}
 */
export async function getCollection(collectionName, options = {}) {
  const constraints = [];
  if (options.publishedOnly) constraints.push(where('published', '==', true));
  constraints.push(orderBy(options.orderField || 'order', 'asc'));
  if (options.cursor) constraints.push(startAfter(options.cursor));
  if (options.pageSize) constraints.push(limit(options.pageSize));

  const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));
  return {
    items: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
    cursor: snapshot.docs.at(-1) || null,
  };
}

export async function getDocument(collectionName, id) {
  return serializeDoc(await getDoc(doc(db, collectionName, id)));
}

export async function getDocumentBySlug(collectionName, slug) {
  const snapshot = await getDocs(query(collection(db, collectionName), where('slug', '==', slug), limit(1)));
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

export async function createDocument(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function setDocument(collectionName, id, data) {
  await setDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateDocument(collectionName, id, data) {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}
