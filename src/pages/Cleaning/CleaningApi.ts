import { db, auth } from "../../firebase/firebaseConfig";
import { Room } from "./Room";
import { collection, addDoc, doc, getDocs, updateDoc, getDoc, deleteDoc } from "firebase/firestore";

const roomsCollection = () =>
    collection(db, "Users", auth.currentUser!.uid, "Room");

export const getRooms = async (): Promise<Room[]> => {
    const snap = await getDocs(roomsCollection());
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Room));
};

export const getRoom = async (id: string): Promise<Room | null> => {
    const ref = doc(db, "Users", auth.currentUser!.uid, "Room", id);
    const data = await getDoc(ref);
    return data.exists() ? ({ id: data.id, ...data.data() } as Room) : null;
};

export const addRoom = async (room: Room) => {
    await addDoc(roomsCollection(), room);
};

export const updateRoom = async (id: string, data: Partial<Room>) => {
    const ref = doc(db, "Users", auth.currentUser!.uid, "Room", id);
    await updateDoc(ref, data);
};

export const deleteRoom = async (id: string) => {
    const ref = doc(db, "Users", auth.currentUser!.uid, "Room", id);
    await deleteDoc(ref);
};
