import { User as FirebaseUser } from "firebase/auth";

export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface FirebaseAuthError {
  code: string;
  message: string;
  customData?: Record<string, unknown>;
}