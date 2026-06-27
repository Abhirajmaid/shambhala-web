import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PROJECTS_COLLECTION = 'projects';

function normalizeProject(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name || 'Untitled project',
    category: data.category || data.name || 'Project',
    tagline: data.tagline || data.description || '',
    status: data.status || 'Draft',
    images: Array.isArray(data.images) ? data.images : [],
    carouselRows: data.carouselRows === 1 ? 1 : 2,
    order: Number.isFinite(data.order) ? data.order : null,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
}

function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    if (a.order !== null && b.order !== null && a.order !== b.order) return a.order - b.order;
    if (a.order !== null && b.order === null) return -1;
    if (a.order === null && b.order !== null) return 1;
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    if (aTime !== bTime) return bTime - aTime;
    return a.name.localeCompare(b.name);
  });
}

function projectQuery(options = {}) {
  const constraints = [];
  if (options.publishedOnly) constraints.push(where('status', '==', 'Published'));
  return constraints.length
    ? query(collection(db, PROJECTS_COLLECTION), ...constraints)
    : collection(db, PROJECTS_COLLECTION);
}

export function subscribeToProjects(options, onNext, onError) {
  return onSnapshot(
    projectQuery(options),
    (snapshot) => onNext(sortProjects(snapshot.docs.map(normalizeProject))),
    onError
  );
}

export function subscribeToProject(projectId, onNext, onError) {
  return onSnapshot(
    doc(db, PROJECTS_COLLECTION, projectId),
    (snapshot) => onNext(snapshot.exists() ? normalizeProject(snapshot) : null),
    onError
  );
}

export async function getPublishedProjects() {
  const snapshot = await getDocs(projectQuery({ publishedOnly: true }));
  return sortProjects(snapshot.docs.map(normalizeProject));
}

export async function createProject(project) {
  const id = project.id;
  const payload = {
    name: project.name,
    category: project.category,
    tagline: project.tagline,
    status: project.status || 'Draft',
    images: Array.isArray(project.images) ? project.images : [],
    carouselRows: project.carouselRows === 1 ? 1 : 2,
    order: Number.isFinite(project.order) ? project.order : Date.now(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, PROJECTS_COLLECTION, id), payload);
  return id;
}

export function updateProject(projectId, updates) {
  return updateDoc(doc(db, PROJECTS_COLLECTION, projectId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export function replaceProjectImages(projectId, images) {
  return updateProject(projectId, { images });
}

export async function updateProjectOrder(projectIds) {
  const batch = writeBatch(db);
  projectIds.forEach((projectId, index) => {
    batch.update(doc(db, PROJECTS_COLLECTION, projectId), {
      order: index,
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

export function deleteProject(projectId) {
  return deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
}
