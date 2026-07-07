"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync logic helper
  const syncToCloud = async (uid: string, key: string, items: string[]) => {
    try {
      const fieldMap: Record<string, string> = {
        "aiv-favorites": "favorites",
        "aiv-downloads": "downloads",
        "aiv-recent": "recent",
        "aiv-pdf-downloads": "pdfDownloads",
      };
      const field = fieldMap[key];
      if (!field) return;

      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, { [field]: items }, { merge: true });
    } catch (err) {
      console.error("Error syncing to Firestore:", err);
    }
  };

  // 1. Listen to Auth State Changes
  useEffect(() => {
    // Process redirect result if page was loaded after a redirect sign-in
    getRedirectResult(auth).catch((err) => {
      console.error("Error processing redirect sign-in result:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // User logged in -> Pull data from Firestore and merge with localStorage
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          const collections = ["aiv-favorites", "aiv-downloads", "aiv-recent", "aiv-pdf-downloads"];
          const fieldMap: Record<string, string> = {
            "aiv-favorites": "favorites",
            "aiv-downloads": "downloads",
            "aiv-recent": "recent",
            "aiv-pdf-downloads": "pdfDownloads",
          };

          const firestoreData = userDoc.exists() ? userDoc.data() : {};

          for (const key of collections) {
            const fieldName = fieldMap[key];
            const cloudItems: string[] = firestoreData[fieldName] || [];
            
            // Get local items
            let localItems: string[] = [];
            try {
              const raw = localStorage.getItem(key);
              if (raw) localItems = JSON.parse(raw);
            } catch {}

            // Merge local and cloud items (removing duplicates, keeping order)
            const merged = Array.from(new Set([...localItems, ...cloudItems]));

            // Update localStorage
            localStorage.setItem(key, JSON.stringify(merged));
            
            // Dispatch update event so other client state hooks refresh
            window.dispatchEvent(
              new CustomEvent("collection-update", {
                detail: { key, newValue: JSON.stringify(merged) },
              })
            );

            // Sync merged back to Firestore to ensure parity
            if (merged.length > localItems.length || !userDoc.exists()) {
              await syncToCloud(currentUser.uid, key, merged);
            }
          }
        } catch (err) {
          console.error("Error syncing auth collections on login:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Listen to Local Collection Updates to Push to Cloud
  useEffect(() => {
    if (!user) return;

    const handleCollectionUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; newValue: string }>;
      const { key, newValue } = customEvent.detail;
      try {
        const items = JSON.parse(newValue);
        syncToCloud(user.uid, key, items);
      } catch (err) {
        console.error("Error parsing collection update:", err);
      }
    };

    window.addEventListener("collection-update", handleCollectionUpdate);
    return () => {
      window.removeEventListener("collection-update", handleCollectionUpdate);
    };
  }, [user]);

  // Auth Functions
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    
    try {
      // Try popup sign-in with a 20s timeout race
      const authPromise = signInWithPopup(auth, provider);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => {
          const err = new Error("Popup sign-in timed out. Falling back to redirect.");
          (err as any).code = "auth/popup-blocked";
          reject(err);
        }, 20000)
      );
      await Promise.race([authPromise, timeoutPromise]);
    } catch (err: any) {
      console.warn("Popup authentication failed or timed out. Attempting redirect fallback:", err);
      // Fall back to redirect if popup is blocked, cancelled, closed, or timed out
      if (
        err.code === "auth/popup-blocked" ||
        err.code === "auth/cancelled-popup-request" ||
        err.code === "auth/popup-closed-by-user" ||
        err.message?.includes("timed out")
      ) {
        await signInWithRedirect(auth, provider);
      } else {
        throw err;
      }
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
