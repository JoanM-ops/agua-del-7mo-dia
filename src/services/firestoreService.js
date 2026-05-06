import {
  collection,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

const CLIENTES_COLLECTION = 'clientes';
const ENTREGAS_COLLECTION = 'entregas';

function normalizeDoc(snapshot) {
  const data = snapshot.data();
  return {
    ...data,
    id: data.id ?? snapshot.id,
  };
}

async function fetchCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(normalizeDoc);
}

async function saveCollection(collectionName, records) {
  const batch = writeBatch(db);

  records.forEach((record) => {
    const documentId = String(record.id ?? Date.now());
    batch.set(doc(db, collectionName, documentId), {
      ...record,
      id: record.id ?? documentId,
    });
  });

  await batch.commit();
}

export async function fetchClientes() {
  return fetchCollection(CLIENTES_COLLECTION);
}

export async function saveClientes(clientes) {
  return saveCollection(CLIENTES_COLLECTION, clientes);
}

export async function fetchEntregas() {
  return fetchCollection(ENTREGAS_COLLECTION);
}

export async function saveEntregas(entregas) {
  return saveCollection(ENTREGAS_COLLECTION, entregas);
}
