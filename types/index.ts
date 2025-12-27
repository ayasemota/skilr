export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
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
  id: number;
  amount: number;
  date: string;
  status: string;
  reference?: string;
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
