// Firebase configuration based on blueprint:firebase_barebones_javascript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCIyvQUmkbyqK9L8B6uPdQAOjTYnF6Fqrc",
  authDomain: "herhealth-17e26.firebaseapp.com",
  projectId: "herhealth-17e26",
  storageBucket: "herhealth-17e26.firebasestorage.app",
  messagingSenderId: "95922159983",
  appId: "1:95922159983:web:9ec4764e3d0aa0b66ee89a",
  measurementId: "G-81NG3X534J"
};

const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore Database
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create user profile in Firestore
    await setDoc(doc(db, "users", result.user.uid), {
      name,
      email,
      createdAt: serverTimestamp(),
      cycleData: {
        averageCycleLength: 28,
        averagePeriodDuration: 5,
      }
    });
    return result.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No user is currently signed in");
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
  } catch (error: any) {
    console.error("Error changing password:", error);
    if (error.code === "auth/wrong-password") {
      throw new Error("Current password is incorrect");
    } else if (error.code === "auth/weak-password") {
      throw new Error("New password is too weak. Use at least 6 characters");
    }
    throw error;
  }
};

export const deleteAccount = async (password: string) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No user is currently signed in");
    }

    const userId = user.uid;

    // Re-authenticate user before deleting account
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Delete user data from Firestore
    // Delete daily logs subcollection
    const dailyLogsQuery = query(collection(db, "users", userId, "dailyLogs"));
    const dailyLogsSnapshot = await getDocs(dailyLogsQuery);
    await Promise.all(dailyLogsSnapshot.docs.map(doc => deleteDoc(doc.ref)));

    // Delete periods subcollection
    const periodsQuery = query(collection(db, "users", userId, "periods"));
    const periodsSnapshot = await getDocs(periodsQuery);
    await Promise.all(periodsSnapshot.docs.map(doc => deleteDoc(doc.ref)));

    // Delete user document
    await deleteDoc(doc(db, "users", userId));

    // Delete user from Firebase Auth
    await deleteUser(user);
  } catch (error: any) {
    console.error("Error deleting account:", error);
    if (error.code === "auth/wrong-password") {
      throw new Error("Password is incorrect");
    }
    throw error;
  }
};

// Firestore functions
export const createUserProfile = async (userId: string, data: any) => {
  await setDoc(doc(db, "users", userId), data);
};

export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (userId: string, data: any) => {
  await updateDoc(doc(db, "users", userId), data);
};

// Daily log functions
export const logDailyEntry = async (userId: string, data: {
  date: string;
  mood?: string;
  symptoms?: string[];
  flowIntensity?: number;
  note?: string;
}) => {
  const dailyLogsRef = collection(db, "users", userId, "dailyLogs");
  
  // Filter out undefined values
  const cleanData: any = { date: data.date };
  if (data.mood !== undefined) cleanData.mood = data.mood;
  if (data.symptoms !== undefined) cleanData.symptoms = data.symptoms;
  if (data.flowIntensity !== undefined) cleanData.flowIntensity = data.flowIntensity;
  if (data.note !== undefined) cleanData.note = data.note;
  
  // Check if entry exists for this date
  const q = query(dailyLogsRef, where("date", "==", data.date));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    // Update existing entry
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: serverTimestamp(),
    });
  } else {
    // Create new entry
    await addDoc(dailyLogsRef, {
      ...cleanData,
      createdAt: serverTimestamp(),
    });
  }
};

export const getDailyLogs = async (userId: string, startDate?: string, endDate?: string) => {
  let q = query(collection(db, "users", userId, "dailyLogs"));
  
  if (startDate) {
    q = query(q, where("date", ">=", startDate));
  }
  if (endDate) {
    q = query(q, where("date", "<=", endDate));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Period tracking functions
export const logPeriod = async (userId: string, data: {
  startDate: string;
  endDate?: string;
  flowIntensity?: number;
}) => {
  await addDoc(collection(db, "users", userId, "periods"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getPeriods = async (userId: string) => {
  const q = query(
    collection(db, "users", userId, "periods")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePeriodEndDate = async (userId: string, periodId: string, endDate: string) => {
  const docRef = doc(db, "users", userId, "periods", periodId);
  await updateDoc(docRef, {
    endDate,
    updatedAt: serverTimestamp(),
  });
};

// Storage functions
export const uploadFile = async (userId: string, file: File, path: string) => {
  const storageRef = ref(storage, `users/${userId}/${path}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Auth state observer
export const observeAuthState = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};
