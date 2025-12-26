import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { Payment } from "@/types";

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setPayments([]);
      setLoading(false);
      return;
    }

    const paymentsQuery = query(
      collection(db, "payments"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      paymentsQuery,
      (snapshot) => {
        const paymentsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id,
            amount: data.amount,
            date: data.date,
            status: data.status,
          } as Payment;
        });
        setPayments(paymentsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addPayment = async (
    amount: number,
    vatAmount: number,
    transactionFee: number,
    total: number
  ) => {
    if (!auth.currentUser) throw new Error("Not authenticated");

    try {
      const paymentId = Date.now();
      await addDoc(collection(db, "payments"), {
        userId: auth.currentUser.uid,
        id: paymentId,
        amount: total,
        baseAmount: amount,
        vatAmount,
        transactionFee,
        date: new Date().toISOString().split("T")[0],
        status: "Completed",
        createdAt: new Date().toISOString(),
      });
    } catch (error: unknown) {
      console.error("Error adding payment:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to add payment");
    }
  };

  return { payments, loading, addPayment };
};
