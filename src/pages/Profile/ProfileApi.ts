import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";


// Get profile of currently logged-in user
export async function getUserProfile() {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const ref = doc(db, "Users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        console.log("User profile not found");
        return {};
    }

    return snap.data();
}

// Update profile of logged-in user
export async function updateUserProfile(data: any) {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const ref = doc(db, "Users", user.uid);
    await updateDoc(ref, data);
}
