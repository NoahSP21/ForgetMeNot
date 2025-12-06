// StudyApi.ts
import { db, auth } from '../../firebase/firebaseConfig';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';



const collectionRef = () => collection(db, 'Users', auth.currentUser!.uid, 'StudyPlans');

export const getStudyPlans = async () => {
  const q = query(collectionRef(), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
};

export const getStudyPlan = async (id: string) => {
  const ref = doc(db, 'Users', auth.currentUser!.uid, 'StudyPlans', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) };
};

export const addStudyPlan = async (plan: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const payload = {
    ...plan,
    createdAt: serverTimestamp(),
    nextOccurrence: null 
  };

  const r = await addDoc(collection(db, 'Users', user.uid, 'StudyPlans'), payload);
  return r.id;
};


export const updateStudyPlan = async (id: string, data: any) => {
  const ref = doc(db, 'Users', auth.currentUser!.uid, 'StudyPlans', id);
  await updateDoc(ref, { ...data });
};

export const deleteStudyPlan = async (id: string) => {
  const ref = doc(db, 'Users', auth.currentUser!.uid, 'StudyPlans', id);
  await deleteDoc(ref);
};
