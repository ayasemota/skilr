import { useState, useMemo } from "react";
import { User as UserIcon, Mail, Phone } from "lucide-react";
import { User as UserType, Payment, PaystackResponse } from "@/types";
import { PAYSTACK_PUBLIC_KEY, convertToKobo } from "@/lib/paystack";
import { usePaystack } from "@/hooks/usePaystack";

interface PaymentsPageProps {
  user: UserType;
  payments: Payment[];
  onAddPayment: (payment: Payment) => void;
}

const VAT_RATE = 4;
const TRANSACTION_FEE = Math.floor(Math.random() * (600 - 400 + 1)) + 300;

export const PaymentsPage = ({
  user,
  payments,
  onAddPayment,
}: PaymentsPageProps) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isCheckout, setIsCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { initializePayment } = usePaystack();

  const stats = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    return { total };
  }, [payments]);

  const baseAmount = paymentAmount ? parseFloat(paymentAmount) : 0;
  const vat = baseAmount * (VAT_RATE / 100);
  const total = baseAmount + vat + TRANSACTION_FEE;

  const handleContinue = () => {
    if (paymentAmount && parseFloat(paymentAmount) > 0) {
      setIsCheckout(true);
    }
  };

  const handleConfirmPayment = () => {
    const config = {
      email: user.email,
      amount: convertToKobo(total),
      publicKey: PAYSTACK_PUBLIC_KEY,
      firstname: user.firstName,
      lastname: user.lastName,
      phone: user.phone,
      ref: `SKILR-${Date.now()}`,
      onSuccess: (response: PaystackResponse) => {
        const newPayment: Payment = {
          id: Date.now(),
          amount: baseAmount,
          date: new Date().toISOString().split("T")[0],
          status: "Completed",
          reference: response.reference,
        };
        onAddPayment(newPayment);
        setShowSuccess(true);
        setIsCheckout(false);
        setPaymentAmount("");
        setTimeout(() => setShowSuccess(false), 3000);
      },
      onClose: () => {
        console.log("Payment popup closed");
      },
    };

    initializePayment(config);
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
            <svg
              className="w-10 h-10 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
          <p className="text-gray-400">
            Your payment has been processed successfully
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            View Payments
          </button>
        </div>
      </div>
    );
  }

  if (isCheckout) {
    return (
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setIsCheckout(false)}
          className="text-gray-400 hover:text-white mb-6 transition-colors duration-300"
        >
          ← Back
        </button>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white">Payment Summary</h2>
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Base Amount</span>
                <span>₦{baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>VAT ({VAT_RATE}%)</span>
                <span>₦{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Transaction Fee</span>
                <span>₦{TRANSACTION_FEE.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700/50 pt-2 mt-2"></div>
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>₦{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-3">
                <UserIcon className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-white">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Mail className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-white">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleConfirmPayment}
            className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Pay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Total Amount Paid
          </h3>
          <p className="text-3xl font-bold text-white">
            ₦{stats.total.toFixed(2)}
          </p>
        </div>
        <div className="bg-linear-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Uncleared Amount
          </h3>
          <p className="text-3xl font-bold text-white">₦0.00</p>
        </div>
        <div className="bg-linear-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Total Transactions
          </h3>
          <p className="text-3xl font-bold text-white">{payments.length}</p>
        </div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Make a Payment</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount to Pay (₦)
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="1000"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300"
            />
          </div>
          <button
            onClick={handleContinue}
            disabled={!paymentAmount || parseFloat(paymentAmount) < 100}
            className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Payment History</h2>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No payment history yet</p>
            <p className="text-gray-500 text-xs mt-1">
              Your payments will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/30">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Reference
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-700/10 hover:bg-gray-700/10 transition-colors duration-300"
                  >
                    <td className="py-4 px-4 text-gray-300">{payment.date}</td>
                    <td className="py-4 px-4 text-white font-medium">
                      ₦{payment.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-xs">
                      {payment.reference || "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
