import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, SignUpForm } from "@/types";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (form: SignUpForm) => {
    if (form.password !== form.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const userData: User = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Sign up failed"
      );
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await loadUserData(userCredential.user);
      setIsLoggedIn(true);
      localStorage.setItem("loginTime", Date.now().toString());
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Sign in failed"
      );
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("loginTime");
  };

  return { isLoggedIn, user, loading, signUp, signIn, signOut };
};
