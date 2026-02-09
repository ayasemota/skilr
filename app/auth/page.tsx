"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/components/pages/AuthPage";
import { Preloader } from "@/components/Preloader";

export default function Auth() {
  const { isLoggedIn, signUp, signIn, forgotPassword, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <AuthPage
      onSignIn={signIn}
      onSignUp={signUp}
      onForgotPassword={forgotPassword}
    />
  );
}
