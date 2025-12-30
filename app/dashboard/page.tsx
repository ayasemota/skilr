"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePayments } from "@/hooks/usePayments";
import { Sidebar } from "@/components/Sidebar";
import { DashboardPage } from "@/components/DashboardPage";
import { PaymentsPage } from "@/components/PaymentsPage";
import { HelpPage } from "@/components/HelpPage";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { UnavailableModal } from "@/components/UnavailableModal";
import { Preloader } from "@/components/Preloader";

export default function Dashboard() {
  const { isLoggedIn, user, signOut, loading } = useAuth();
  const { payments, loading: paymentsLoading } = usePayments(
    user?.email || null
  );
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash && ["dashboard", "payments", "help"].includes(hash)
      ? hash
      : "dashboard";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/auth");
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.location.hash = currentPage;
  }, [currentPage]);

  const handleSignOut = () => {
    signOut();
    router.push("/auth");
  };

  if (showPreloader || loading) {
    return <Preloader />;
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <>
      <div className="min-h-dvh bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-400 hover:text-white transition-colors duration-300"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Logo />
            </div>
            <ProfileDropdown
              user={user}
              onSignOut={handleSignOut}
              onShowUnavailable={() => setShowUnavailableModal(true)}
            />
          </div>
        </header>
        <Sidebar
          currentPage={currentPage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={setCurrentPage}
        />
        <div className="lg:pl-76 pt-2">
          <main className="p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
            {currentPage === "dashboard" && (
              <DashboardPage
                user={user}
                payments={payments}
                paymentsLoading={paymentsLoading}
                onNavigateToPayments={() => setCurrentPage("payments")}
                onShowUnavailable={() => setShowUnavailableModal(true)}
              />
            )}
            {currentPage === "payments" && (
              <PaymentsPage
                user={user}
                payments={payments}
                paymentsLoading={paymentsLoading}
              />
            )}
            {currentPage === "help" && <HelpPage />}
            <Footer />
          </main>
        </div>
      </div>
      <UnavailableModal
        isOpen={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
      />
    </>
  );
}
