// AppointmentApi.ts

import { db, auth } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

import { Appointment, Section } from "./AppointmentTypes";


// Defaults always stable, always first
export const DEFAULT_SECTIONS: Section[] = ["WORK", "DOCTOR", "TRAVEL"];


// =============================
// 1) GET ALL SECTIONS (stable)
// =============================
export const getAllSections = async (): Promise<Section[]> => {
  const user = auth.currentUser;

  if (!user) return DEFAULT_SECTIONS; // 🔒 evitar crash cuando user no está listo

  const ref = collection(db, "Users", user.uid, "Appointments");
  const snap = await getDocs(ref);

  const custom = new Set<string>();

  snap.forEach(doc => {
    const data = doc.data();
    if (data.section && !DEFAULT_SECTIONS.includes(data.section)) {
      custom.add(String(data.section));
    }
  });

  return [...DEFAULT_SECTIONS, ...Array.from(custom)];
};


// =============================
// 2) GET APPOINTMENTS BY CONFIRMED
// =============================
export const getAppointments = async (confirmed: boolean) => {
    const ref = collection(db, "Users", auth.currentUser!.uid, "Appointments");
    const q = query(ref, where("confirmed", "==", confirmed));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Appointment, "id">)
    }));
};



// =============================
// 3) GET *ALL* APPOINTMENTS SAFELY
// =============================
export const getAllAppointments = async (): Promise<Appointment[]> => {
    const ref = collection(db, "Users", auth.currentUser!.uid, "Appointments");
    const snap = await getDocs(ref);

    return snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Appointment, "id">)
    }));
};



// =============================
// 4) CREATE APPOINTMENT (safe)
// =============================
export const createAppointment = async (data: Omit<Appointment, "id">) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const ref = collection(db, "Users", user.uid, "Appointments");
  return await addDoc(ref, data);
};


// =============================
// 5) UPDATE APPOINTMENT
// =============================
export const updateAppointment = async (id: string, data: Partial<Appointment>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const ref = doc(db, "Users", user.uid, "Appointments", id);
  await updateDoc(ref, data);
};


// =============================
// 6) DELETE APPOINTMENT
// =============================
export const deleteAppointment = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const ref = doc(db, "Users", user.uid, "Appointments", id);
  await deleteDoc(ref);
};
