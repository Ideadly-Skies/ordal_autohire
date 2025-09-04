"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";

// ------------------ Types ------------------
type AccountType = "jobseeker" | "employer";

type AuthResults = {
  success: boolean;
  message?: string;
};

type CompanyData = {
  aboutCompany: string;
  companyName: string;
  contactEmail: string;
  employeeCount: number;
  industry: string;
  location: string;
  website?: string;
};

export type User = {
  id: string;
  personal_info: { name: string; email: string };
  accountType: AccountType;
  plan: "free" | "pro";
  background_info?: { yoe?: number };
  upload_cv: boolean;
  // Add these for payment integration compatibility
  displayName?: string;
  email?: string;
  phone?: string;
  companyData?: CompanyData; // Add this parameter
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResults>;
  register: (
    name: string,
    email: string,
    password: string,
    accountType: AccountType,
    companyData?: CompanyData // Add this parameter
  ) => Promise<AuthResults>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

// ------------------ Context ------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const jobseekerRef = doc(db, "jobseekers", firebaseUser.uid);
          const jobposterRef = doc(db, "jobposters", firebaseUser.uid);

          const jobseekerSnap = await getDoc(jobseekerRef);
          if (jobseekerSnap.exists()) {
            setUser({
              id: firebaseUser.uid,
              ...(jobseekerSnap.data() as Omit<User, "id">),
            });
            setIsLoading(false);
            return;
          }

          const jobposterSnap = await getDoc(jobposterRef);
          if (jobposterSnap.exists()) {
            setUser({
              id: firebaseUser.uid,
              ...(jobposterSnap.data() as Omit<User, "id">),
            });
            setIsLoading(false);
            return;
          }

          setUser(null);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Register user
  const register = async (
    name: string,
    email: string,
    password: string,
    accountType: AccountType,
    companyData?: CompanyData // Add this parameter for employer data
  ): Promise<AuthResults> => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      let newUser: User = {
        id: uid,
        personal_info: { name, email },
        accountType,
        plan: "free", // Default plan for all users
        upload_cv: false, // Default value, will be overridden for employer
      };

      // If employer, add company data
      if (accountType === "employer" && companyData) {
        newUser = {
          ...newUser,
          accountType: "employer",
          companyData: companyData,
        };
      } else if (accountType === "jobseeker") {
        // Add jobseeker specific fields
        newUser = {
          ...newUser,
          background_info: { yoe: 0 },
          upload_cv: false,
        };
      }

      // Choose collection based on accountType
      const collectionName =
        accountType === "jobseeker" ? "jobseekers" : "jobposters";

      await setDoc(doc(db, collectionName, uid), newUser);
      setUser(newUser);
      return { success: true };
    } catch (err: unknown) {
      let message = "Something went wrong.";
      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: string }).code;
        switch (code) {
          case "auth/email-already-in-use":
            message = "This email is already registered.";
            break;
          case "auth/invalid-email":
            message = "Invalid email format.";
            break;
          case "auth/weak-password":
            message = "Password must be at least 6 characters.";
            break;
          case "auth/network-request-failed":
            message = "Network error, please try again.";
            break;
        }
      }

      return { success: false, message }; // kirim balik ke form
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  // ------------------ Login user ------------------
  const login = async (
    email: string,
    password: string
  ): Promise<AuthResults> => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // 🔎 Cari di jobseekers
      const jobseekerRef = doc(db, "jobseekers", uid);
      const jobposterRef = doc(db, "jobposters", uid);

      const jobseekerSnap = await getDoc(jobseekerRef);
      if (jobseekerSnap.exists()) {
        setUser({
          id: uid,
          ...(jobseekerSnap.data() as Omit<User, "id">),
        });
        return { success: true };
      }

      const jobposterSnap = await getDoc(jobposterRef);
      if (jobposterSnap.exists()) {
        setUser({
          id: uid,
          ...(jobposterSnap.data() as Omit<User, "id">),
        });
        return { success: true };
      }

      // Kalau nggak ada di keduanya
      return { success: false, message: "User data not found in database." };
    } catch (err: unknown) {
      console.error("Login error:", err);
      let message = "Login failed. Please try again.";

      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: string }).code;
        switch (code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            message = "Email or password is incorrect.";
            break;
          case "auth/invalid-email":
            message = "Invalid email format.";
            break;
          case "auth/network-request-failed":
            message = "Network error. Please check your connection.";
            break;
        }
      }

      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ------------------ Hook ------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
