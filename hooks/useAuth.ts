import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, SignUpForm } from "@/types";
import { ErrorMessages } from "@/lib/errorMessages";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      if (firebaseUser) {
        unsubscribeUserDoc = onSnapshot(
          doc(db, "users", firebaseUser.uid),
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              setUser(docSnapshot.data() as User);
            }
            setIsLoggedIn(true);
            setLoading(false);
          },
          (error) => {
            console.error("Error listening to user data:", error);
            setLoading(false);
          },
        );
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
    };
  }, []);

  const signUp = async (form: SignUpForm) => {
    if (form.password !== form.confirmPassword) {
      throw new Error("The passwords do not match. Please try again.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      const userData: User = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email,
        phone: form.phone,
        status: "",
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      throw new Error(ErrorMessages(error));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("loginTime", Date.now().toString());
    } catch (error) {
      throw new Error(ErrorMessages(error));
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("loginTime");
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(ErrorMessages(error));
    }
  };

  const resetPassword = async (oobCode: string, newPassword: string) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error) {
      throw new Error(ErrorMessages(error));
    }
  };

  const updateUnclearedAmount = async (
    email: string,
    amountToReduce: number,
  ) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user logged in");

      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentUncleared = userData.unclearedAmount || 0;
        const newUncleared = Math.max(0, currentUncleared - amountToReduce);

        await updateDoc(userRef, {
          unclearedAmount: newUncleared,
        });

        if (user) {
          setUser({ ...user, unclearedAmount: newUncleared });
        }
      }
    } catch (error) {
      console.error("Error updating uncleared amount:", error);
      throw error;
    }
  };

  const updateProfile = async (fields: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user logged in");

      const sanitized = {
        firstName: fields.firstName.replace(/\s/g, ""),
        lastName: fields.lastName.replace(/\s/g, ""),
        phone: fields.phone.trim(),
      };

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, sanitized);

      if (user) {
        setUser({ ...user, ...sanitized });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return {
    isLoggedIn,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    resetPassword,
    updateUnclearedAmount,
    updateProfile,
  };
};
