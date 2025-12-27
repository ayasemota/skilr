"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Payment } from "@/types";
import { AuthPage } from "@/components/AuthPage";
import { Sidebar } from "@/components/Sidebar";
import { DashboardPage } from "@/components/DashboardPage";
import { PaymentsPage } from "@/components/PaymentsPage";
import { HelpPage } from "@/components/HelpPage";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { ProfileDropdown } from "@/components/ProfileDropdown";

export default function Home() {
  const { isLoggedIn, user, signUp, signIn, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  const handleAddPayment = (payment: Payment) => {
    setPayments([payment, ...payments]);
  };

  if (!isLoggedIn || !user) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
      <div className="lg:pl-64 pt-2">
        <main className="p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {currentPage === "dashboard" && (
            <DashboardPage
              user={user}
              payments={payments}
              onNavigateToPayments={() => setCurrentPage("payments")}
            />
          )}
          {currentPage === "payments" && (
            <PaymentsPage
              user={user}
              payments={payments}
              onAddPayment={handleAddPayment}
            />
          )}
          {currentPage === "help" && <HelpPage />}
          <Footer />
        </main>
      </div>
    </div>
  );
}