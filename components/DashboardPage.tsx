import { User, Payment } from "@/types";

interface DashboardPageProps {
  user: User;
  payments: Payment[];
  paymentsLoading: boolean;
  onNavigateToPayments: () => void;
  onShowUnavailable: () => void;
  announcements?: { title: string; description: string }[];
  upcomingEvents?: { title: string; description: string; date: string }[];
}

export const DashboardPage = ({
  user,
  payments,
  paymentsLoading,
  onNavigateToPayments,
  onShowUnavailable,
  announcements = [],
  upcomingEvents = [],
}: DashboardPageProps) => {
  const recentPayments = payments.slice(0, 2);

  const quickLinks = [
    {
      label: "Make Payment",
      onClick: onNavigateToPayments,
    },
    {
      label: "Edit Profile",
      onClick: onShowUnavailable,
    },
    {
      label: "Settings",
      onClick: onShowUnavailable,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Hello, {user.firstName} {user.lastName}!
        </h1>
        <p className="text-gray-400">{user.email}</p>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[18rem] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Upcoming Events
          </h2>
          {upcomingEvents.length ? (
            upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors duration-300 mb-3"
              >
                <h3 className="font-medium text-white mb-1">{event.title}</h3>
                <p className="text-sm text-gray-400">{event.description}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {event.date}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 text-center text-gray-400">
              No upcoming events
            </div>
          )}
        </div>

        <div className="flex-1 min-w-[18rem] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Announcements
          </h2>
          {announcements.length ? (
            announcements.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors duration-300 mb-3"
              >
                <h3 className="text-sm font-medium text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 text-center text-gray-400">
              No announcements
            </div>
          )}
        </div>

        <div className="flex-1 min-w-[18rem] bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Recent Payments
            </h2>
            <button
              onClick={onNavigateToPayments}
              className="text-sm text-blue-400"
            >
              View All
            </button>
          </div>

          {paymentsLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recentPayments.length ? (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30"
                >
                  <p className="text-lg font-bold text-white">
                    ₦{payment.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{payment.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 text-center text-gray-400">
              No payments yet
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-bold text-white text-3xl mb-6">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={link.onClick}
              className="flex-1 min-w-48 py-6 rounded-xl font-semibold text-white bg-gray-800/60 border border-gray-700/50"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};