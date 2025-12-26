"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePayments } from "@/hooks/usePayments";
import { AuthPage } from "@/components/AuthPage";
import { Sidebar } from "@/components/Sidebar";
import { UpdateProfileModal } from "@/components/UpdateProfileModal";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { DashboardPage } from "@/components/DashboardPage";
import { PaymentsPage } from "@/components/PaymentsPage";
import { HelpPage } from "@/components/HelpPage";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { ProfileDropdown } from "@/components/ProfileDropdown";

export default function Home() {
  const {
    isLoggedIn,
    user,
    loading: authLoading,
    signUp,
    signIn,
    signOut,
    updateUser,
  } = useAuth();
  const { payments, loading: paymentsLoading, addPayment } = usePayments();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // if (!isLoggedIn) {
  //   return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {showUpdateProfile && (
        <UpdateProfileModal
          user={user}
          onClose={() => setShowUpdateProfile(false)}
          onSave={updateUser}
        />
      )}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
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
            onUpdateProfile={() => setShowUpdateProfile(true)}
            onChangePassword={() => setShowChangePassword(true)}
            onSignOut={signOut}
          />
        </div>
      </header>
      <Sidebar
        currentPage={currentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={setCurrentPage}
      />
      <div className="lg:pl-64 pt-16">
        <main className="p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {currentPage === "dashboard" && (
            <DashboardPage
              user={user}
              payments={payments}
              paymentsLoading={paymentsLoading}
              onNavigateToPayments={() => setCurrentPage("payments")}
            />
          )}
          {currentPage === "payments" && (
            <PaymentsPage
              user={user}
              payments={payments}
              loading={paymentsLoading}
              onAddPayment={addPayment}
            />
          )}
          {currentPage === "help" && <HelpPage />}
          <Footer />
        </main>
      </div>
    </div>
  );
}
