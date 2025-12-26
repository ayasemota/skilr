import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { User, SignUpForm } from "@/types";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emailVerified: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          emailVerified: false,
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          emailVerified: firebaseUser.emailVerified,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const signUp = async (signUpForm: SignUpForm) => {
    if (signUpForm.password !== signUpForm.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    if (signUpForm.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpForm.email,
        signUpForm.password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: signUpForm.firstName,
        lastName: signUpForm.lastName,
        email: signUpForm.email,
        phone: signUpForm.phone,
        createdAt: new Date().toISOString(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to sign up");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to sign in");
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to sign out");
    }
  };

  const updateUser = async (updatedUser: User) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        updatedAt: new Date().toISOString(),
      });
      setUser(updatedUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update user");
    }
  };

  return { isLoggedIn, user, loading, signUp, signIn, signOut, updateUser };
};
