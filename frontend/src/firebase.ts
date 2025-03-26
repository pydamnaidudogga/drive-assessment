import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';

const encodedConfig = import.meta.env.VITE_FIREBSE_CONFIG
// Decode Base64 back to JSON string
const decodedJsonString = atob(encodedConfig);

// Parse the JSON string back to an object
const config = JSON.parse(decodedJsonString);

// Initialize Firebase
const app = initializeApp(config);

// Initialize Firebase Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Add Google Drive scope
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

// Export auth functions with TypeScript types
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export { auth, googleProvider };
export default app;