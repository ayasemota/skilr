import { useState } from "react";
import { Logo } from "./Logo";
import { SignUpForm } from "@/types";

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (form: SignUpForm) => Promise<void>;
}

export const AuthPage = ({ onSignIn, onSignUp }: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });

  const handleSubmit = async (action: () => Promise<void>) => {
    setError("");
    setLoading(true);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500";

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-400">
            {isSignUp
              ? "Start your learning journey"
              : "Continue your learning journey"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          {isSignUp ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["firstName", "lastName"].map((field, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={
                      field === "firstName" ? "First Name" : "Last Name"
                    }
                    value={signUpForm[field as keyof SignUpForm]}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, [field]: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                ))}
              </div>
              {["email", "phone", "password", "confirmPassword"].map(
                (field, i) => (
                  <input
                    key={i}
                    type={
                      field.includes("password")
                        ? "password"
                        : field === "phone"
                        ? "tel"
                        : "email"
                    }
                    placeholder={
                      field === "phone"
                        ? "+234 XXX XXX XXXX"
                        : field.charAt(0).toUpperCase() + field.slice(1)
                    }
                    value={signUpForm[field as keyof SignUpForm]}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, [field]: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                )
              )}
              <button
                onClick={() => handleSubmit(() => onSignUp(signUpForm))}
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign In
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {["email", "password"].map((field, i) => (
                <input
                  key={i}
                  type={field === "password" ? "password" : "email"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={signInForm[field as keyof typeof signInForm]}
                  onChange={(e) =>
                    setSignInForm({ ...signInForm, [field]: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              ))}
              <button
                onClick={() =>
                  handleSubmit(() =>
                    onSignIn(signInForm.email, signInForm.password)
                  )
                }
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <p className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign Up
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
