import { db, auth } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc
} from "firebase/firestore";

import { GroceryList } from "./ToBuyList";

const getUser = () => auth.currentUser?.uid;
const getListCollection = () =>
  collection(db, "Users", getUser()!, "GroceryLists");

// ----------------------------
// Get all grocery lists
// ----------------------------
export const getGroceryLists = async (): Promise<GroceryList[]> => {
  const uid = getUser();
  if (!uid) return [];

  const snapshot = await getDocs(getListCollection());
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as GroceryList),
  }));
};

// ----------------------------
// Get a single list
// ----------------------------
export const getGroceryList = async (id: string): Promise<GroceryList | null> => {
  const uid = getUser();
  if (!uid) return null;

  const ref = doc(db, "Users", uid, "GroceryLists", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return { id: snap.id, ...(snap.data() as GroceryList) };
};

// ----------------------------
// Add a new list
// ----------------------------
export const addGroceryList = async (list: GroceryList) => {
  return await addDoc(getListCollection(), list);
};

// ----------------------------
// Update list
// ----------------------------
export const updateGroceryList = async (id: string, data: Partial<GroceryList>) => {
  const uid = getUser();
  if (!uid) return;

  const ref = doc(db, "Users", uid, "GroceryLists", id);
  await updateDoc(ref, data);
};

// ----------------------------
// Delete list
// ----------------------------
export const deleteGroceryList = async (id: string) => {
  const uid = getUser();
  if (!uid) return;

  const ref = doc(db, "Users", uid, "GroceryLists", id);
  await deleteDoc(ref);
};