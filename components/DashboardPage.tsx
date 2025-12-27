import { User, Payment } from "@/types";

interface DashboardPageProps {
  user: User;
  payments: Payment[];
  onNavigateToPayments: () => void;
  announcements?: { title: string; description: string }[];
  upcomingEvents?: { title: string; description: string; date: string }[];
}

export const DashboardPage = ({
  user,
  payments,
  onNavigateToPayments,
  announcements = [],
  upcomingEvents = [],
}: DashboardPageProps) => {
  const recentPayment = payments.length > 0 ? payments[0] : null;

  const defaultAnnouncements: { title: string; description: string }[] = [
    // { title: "New Course Module", description: "Advanced React patterns now available" },
    // { title: "Holiday Schedule", description: "Check updated holiday hours" },
  ];

  const defaultUpcomingEvents: {
    title: string;
    description: string;
    date: string;
  }[] = [
    // { title: "Live Q&A Session", description: "Join us this Friday at 3:00 PM for an interactive discussion", date: "December 27, 2024" },
  ];

  const allAnnouncements = [...defaultAnnouncements, ...announcements];
  const allUpcomingEvents = [...defaultUpcomingEvents, ...upcomingEvents];

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Hello, {user.firstName}
        </h1>
        <div className="flex items-center gap-2 text-gray-400">
          <span>{user.email}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Upcoming Events
          </h2>
          {allUpcomingEvents.length ? (
            allUpcomingEvents.map((event, index) => (
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

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Announcements
          </h2>
          {allAnnouncements.length ? (
            allAnnouncements.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors duration-300 mb-3"
              >
                <h3 className="font-medium text-white text-sm mb-1">
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
