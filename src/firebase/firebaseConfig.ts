import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//config
const firebaseConfig = {
  apiKey: "AIzaSyBrhn6W4Rv341c88hj7K6ROuYoE4Gk5BTQ",
  authDomain: "reminder-app-e2b53.firebaseapp.com",
  projectId: "reminder-app-e2b53",
  storageBucket: "reminder-app-e2b53.firebasestorage.app",
  messagingSenderId: "220955079349",
  appId: "1:220955079349:web:db6f4033ebfdd4532304fc"
};

//init Firebase
const app = initializeApp(firebaseConfig);

// Export instances so you can import them anywhere
export const auth = getAuth(app);
export const user = auth.currentUser;
export const uid = user?.uid;
export const db = getFirestore(app);
export default app;