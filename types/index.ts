import { Timestamp } from "firebase/firestore";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface Payment {
  id: string | number;
  amount: number;
  date: string;
  status: string;
  reference?: string;
  userEmail?: string;
  createdAt?: Timestamp;
}

export interface PaymentStats {
  totalAmount: number;
  weekAmount: number;
}

export interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
  trxref: string;
}
