import { useState, useEffect } from "react";
import { Logo } from "../Logo";
import { SignUpForm } from "@/types";
import { Eye, EyeOff } from "lucide-react";
import { AuthModal } from "../AuthModal";

interface ModalState {
  isOpen: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (form: SignUpForm) => Promise<void>;
  onForgotPassword?: (email: string) => Promise<void>;
}

export const AuthPage = ({
  onSignIn,
  onSignUp,
  onForgotPassword,
}: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password visibility states
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSignUp(signUpForm);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message;
        if (message.includes("already registered")) {
          setModal({
            isOpen: true,
            type: "info",
            title: "Email Already Registered",
            message:
              "This email is already registered. Would you like to sign in instead?",
            actionText: "Go to Sign In",
            onAction: () => {
              closeModal();
              setIsSignUp(false);
              setSignInForm({ ...signInForm, email: signUpForm.email });
            },
            secondaryActionText: "Try Another Email",
            onSecondaryAction: closeModal,
          });
        } else {
          setError(message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSignIn(signInForm.email, signInForm.password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message;
        if (message.includes("No account found")) {
          setModal({
            isOpen: true,
            type: "info",
            title: "Account Not Found",
            message:
              "No account found with this email. Would you like to create one?",
            actionText: "Create Account",
            onAction: () => {
              closeModal();
              setIsSignUp(true);
              setSignUpForm({ ...signUpForm, email: signInForm.email });
            },
            secondaryActionText: "Try Again",
            onSecondaryAction: closeModal,
          });
        } else {
          setError(message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onForgotPassword) return;

    setError("");
    setLoading(true);
    try {
      await onForgotPassword(forgotPasswordEmail);
      setModal({
        isOpen: true,
        type: "success",
        title: "Email Sent!",
        message:
          "We've sent a password reset link to your email. Please check your inbox and spam folder.",
        actionText: "Back to Sign In",
        onAction: () => {
          closeModal();
          setIsForgotPassword(false);
          setForgotPasswordEmail("");
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message;
        if (message.includes("No account found")) {
          setModal({
            isOpen: true,
            type: "info",
            title: "Account Not Found",
            message:
              "No account found with this email. Would you like to create one?",
            actionText: "Create Account",
            onAction: () => {
              closeModal();
              setIsForgotPassword(false);
              setIsSignUp(true);
              setSignUpForm({ ...signUpForm, email: forgotPasswordEmail });
            },
            secondaryActionText: "Try Another Email",
            onSecondaryAction: closeModal,
          });
        } else {
          setError(message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-dvh bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isForgotPassword
                ? "Reset Password"
                : isSignUp
                  ? "Create Account"
                  : "Welcome Back"}
            </h2>
            <p className="text-gray-400">
              {isForgotPassword
                ? "Enter your email to receive a reset link"
                : isSignUp
                  ? "Start your learning journey"
                  : "Continue your learning journey"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            {isForgotPassword ? (
              // Forgot Password Form
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !onForgotPassword}
                  className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <p className="text-center text-sm text-gray-400">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Back to Sign In
                  </button>
                </p>
              </form>
            ) : isSignUp ? (
              // Sign Up Form
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={signUpForm.firstName}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          firstName: e.target.value.replace(/\s/g, ""),
                        })
                      }
                      placeholder="First Name"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={signUpForm.lastName}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          lastName: e.target.value.replace(/\s/g, ""),
                        })
                      }
                      placeholder="Last Name"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signUpForm.email}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, email: e.target.value })
                    }
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={signUpForm.phone}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        phone: e.target.value.trim(),
                      })
                    }
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      value={signUpForm.password}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          password: e.target.value,
                        })
                      }
                      placeholder="Password"
                      className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showSignUpPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signUpForm.confirmPassword}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm Password"
                      className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
                <p className="text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            ) : (
              // Sign In Form
              <form onSubmit={handleSignInSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signInForm.email}
                    onChange={(e) =>
                      setSignInForm({ ...signInForm, email: e.target.value })
                    }
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError("");
                        setForgotPasswordEmail(signInForm.email);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showSignInPassword ? "text" : "password"}
                      value={signInForm.password}
                      onChange={(e) =>
                        setSignInForm({
                          ...signInForm,
                          password: e.target.value,
                        })
                      }
                      placeholder="Password"
                      className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showSignInPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
                <p className="text-center text-sm text-gray-400">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        actionText={modal.actionText}
        onAction={modal.onAction}
        secondaryActionText={modal.secondaryActionText}
        onSecondaryAction={modal.onSecondaryAction}
      />
    </>
  );
};
