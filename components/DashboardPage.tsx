import { User, Payment } from "@/types";

interface DashboardPageProps {
  user: User;
  payments: Payment[];
  onNavigateToPayments: () => void;
}

export const DashboardPage = ({
  user,
  payments,
  onNavigateToPayments,
}: DashboardPageProps) => {
  const recentPayment = payments.length > 0 ? payments[0] : null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Hello, Welcome {user.firstName} 👋
        </h1>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-sm">Email:</span>
          <span>{user.email}</span>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Upcoming Event
          </h2>
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors duration-300">
            <h3 className="font-medium text-white mb-1">Live Q&A Session</h3>
            <p className="text-sm text-gray-400">
              Join us this Friday at 3:00 PM for an interactive discussion
            </p>
            <span className="text-xs text-gray-500 mt-2 block">
              December 27, 2024
            </span>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Announcements
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors duration-300">
              <h3 className="font-medium text-white text-sm mb-1">
                New Course Module
              </h3>
              <p className="text-xs text-gray-400">
                Advanced React patterns now available
              </p>
            </div>
            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors duration-300">
              <h3 className="font-medium text-white text-sm mb-1">
                Holiday Schedule
              </h3>
              <p className="text-xs text-gray-400">
                Check updated holiday hours
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Payment</h2>
            <button
              onClick={onNavigateToPayments}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              View All
            </button>
          </div>
          {recentPayment ? (
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-2xl font-bold text-white">
                    ₦{recentPayment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">Course payment</p>
                </div>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                  {recentPayment.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">{recentPayment.date}</p>
            </div>
          ) : (
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 text-center">
              <p className="text-sm text-gray-400 mb-2">No payments yet</p>
              <button
                onClick={onNavigateToPayments}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Make your first payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
