import { useState } from "react";
import { User, Payment } from "@/types";
import { X, Calendar, Megaphone } from "lucide-react";

interface DashboardPageProps {
  user: User;
  payments: Payment[];
  paymentsLoading: boolean;
  onNavigateToPayments: () => void;
  onShowUnavailable: () => void;
  announcements?: { id?: string; title: string; description: string }[];
  upcomingEvents?: {
    id?: string;
    title: string;
    description: string;
    date: string;
  }[];
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85dvh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(85dvh-80px)] p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = ({
  user,
  payments,
  paymentsLoading,
  onNavigateToPayments,
  onShowUnavailable,
  announcements = [],
  upcomingEvents = [],
}: DashboardPageProps) => {
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);

  const recentPayments = payments.slice(0, 2);
  const displayEvents = upcomingEvents.slice(0, 3);
  const displayAnnouncements = announcements.slice(0, 3);

  const quickLinks = [
    { label: "Make Payment", onClick: onNavigateToPayments },
    { label: "Edit Profile", onClick: onShowUnavailable },
    { label: "Settings", onClick: onShowUnavailable },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Hello, {user.firstName} {user.lastName}!
          </h1>
          <p className="text-gray-400">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-400" size={20} />
                <h2 className="text-xl font-semibold text-white">
                  Upcoming Events
                </h2>
              </div>
              {upcomingEvents.length > 3 && (
                <button
                  onClick={() => setShowEventsModal(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View All
                </button>
              )}
            </div>
            {displayEvents.length ? (
              <div className="space-y-3">
                {displayEvents.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors duration-300 cursor-pointer"
                    onClick={() => setShowEventsModal(true)}
                  >
                    <h3 className="font-medium text-white mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {event.description}
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {event.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 text-center text-gray-400">
                No upcoming events
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="text-purple-400" size={20} />
                <h2 className="text-xl font-semibold text-white">
                  Announcements
                </h2>
              </div>
              {announcements.length > 3 && (
                <button
                  onClick={() => setShowAnnouncementsModal(true)}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All
                </button>
              )}
            </div>
            {displayAnnouncements.length ? (
              <div className="space-y-3">
                {displayAnnouncements.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-purple-500/30 transition-colors duration-300 cursor-pointer"
                    onClick={() => setShowAnnouncementsModal(true)}
                  >
                    <h3 className="text-sm font-medium text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 text-center text-gray-400">
                No announcements
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Recent Payments
              </h2>
              <button
                onClick={onNavigateToPayments}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
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
                      ₦{formatCurrency(payment.amount)}
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
          <h2 className="font-bold text-white text-2xl md:text-3xl mb-6">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.onClick}
                className="py-6 rounded-xl font-semibold text-white bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 transition-all duration-300"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showEventsModal}
        onClose={() => setShowEventsModal(false)}
        title="Upcoming Events"
      >
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <div
                key={event.id || index}
                className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Calendar className="text-blue-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                </div>
                <p className="text-gray-300">{event.description}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No upcoming events</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showAnnouncementsModal}
        onClose={() => setShowAnnouncementsModal(false)}
        title="Announcements"
      >
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <div
                key={announcement.id || index}
                className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Megaphone className="text-purple-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-white flex-1">
                    {announcement.title}
                  </h3>
                </div>
                <p className="text-gray-300">{announcement.description}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Megaphone size={48} className="mx-auto mb-4 opacity-50" />
              <p>No announcements</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
