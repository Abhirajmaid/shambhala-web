import { getAdminDb } from './admin';

function hasAdminCredentials() {
  return Boolean(
    (process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
      && process.env.FIREBASE_ADMIN_CLIENT_EMAIL
      && process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

function toPlain(value) {
  if (!value) return value;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(toPlain);
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toPlain(item)]));
  }
  return value;
}

export async function getServerCollection(collectionName, options = {}) {
  let ref = getAdminDb().collection(collectionName);
  if (options.publishedOnly) ref = ref.where('published', '==', true);
  ref = ref.orderBy(options.orderField || 'order', 'asc');
  if (options.limit) ref = ref.limit(options.limit);
  const snapshot = await ref.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...toPlain(doc.data()) }));
}

export async function getServerDoc(collectionName, id) {
  const snapshot = await getAdminDb().collection(collectionName).doc(id).get();
  return snapshot.exists ? { id: snapshot.id, ...toPlain(snapshot.data()) } : null;
}

export async function getServerDocBySlug(collectionName, slug) {
  const snapshot = await getAdminDb().collection(collectionName).where('slug', '==', slug).limit(1).get();
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...toPlain(snapshot.docs[0].data()) };
}

export async function getSingleton(collectionName, id = 'main') {
  if (!hasAdminCredentials()) return null;
  try {
    return await getServerDoc(collectionName, id);
  } catch (error) {
    console.warn(`Unable to load singleton ${collectionName}/${id}`, error.message);
    return null;
  }
}

export async function getPublicList(collectionName, options = {}) {
  if (!hasAdminCredentials()) return [];
  try {
    return await getServerCollection(collectionName, { publishedOnly: true, ...options });
  } catch (error) {
    console.warn(`Unable to load collection ${collectionName}`, error.message);
    return [];
  }
}
