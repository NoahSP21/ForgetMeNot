import { db } from "../../firebase/firebaseConfig"; 
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import Reminder from "./Reminder";

export async function getUserReminders(uid: string): Promise<Reminder[]> {
    const ref = collection(db, "Users", uid, "Reminders");
    const snapshot = await getDocs(ref);
  
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Reminder, "id">)
    }));
  }

  export async function addReminder(uid: string, reminder: Reminder) {
    const ref = collection(db, "Users", uid, "Reminders");
    await addDoc(ref, reminder);
  }
  
  export async function updateReminder(uid: string, reminder: Reminder) {
    if (!reminder.id) return;
    const ref = doc(db, "Users", uid, "Reminders", reminder.id);
  
    const payload = {
      title: reminder.title,
      description: reminder.description
    };
  
    await updateDoc(ref, payload);
  }
  
  
  export async function deleteReminder(uid: string, id: string) {
    const ref = doc(db, "Users", uid, "Reminders", id);
    await deleteDoc(ref);
  }