// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import 
{ getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User
} from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: ""
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const functions = getFunctions();

/**
 * Sign in with Google
 * @returns A promise that resolves with the user credential
 */

export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Sign out with Google
 * @returns A promise that resolves when the user is signed out
 */

export function signOutWithGoogle() {
  return auth.signOut();
}

/**
 * Helper function to listen for changes in the user's authentication state
 * @param callback - The callback function to be called when the user's authentication state changes
 * @returns A function to unsubscribe from the listener
 */

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
