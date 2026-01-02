export const ErrorMessages = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return "An error occurred. Please try again.";
  }

  const message = error.message;

  const errorMap: { [key: string]: string } = {
    "auth/invalid-credential": "Invalid email or password. Please try again.",
    "auth/user-not-found":
      "No account found with this email. Please sign up first.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled":
      "This account has been disabled. Please contact support.",

    "auth/email-already-in-use":
      "This email is already registered. Please sign in instead.",
    "auth/weak-password":
      "Password should be at least 6 characters long. Please use a stronger password.",
    "auth/invalid-password":
      "Password should be at least 6 characters long. Please use a stronger password.",
    "auth/operation-not-allowed":
      "Account creation is currently disabled. Please contact support.",

    "auth/network-request-failed":
      "Network error. Please check your internet connection and try again.",
    "auth/too-many-requests":
      "Too many login attempts. Please try again later.",
    "auth/internal-error": "Server error. Please try again in a few moments.",
  };

  for (const [code, humanMessage] of Object.entries(errorMap)) {
    if (message.includes(code)) {
      return humanMessage;
    }
  }

  if (message.includes("Passwords do not match")) {
    return "The passwords do not match. Please try again.";
  }

  if (message.includes("Sign up failed")) {
    return "Account creation failed. Please try again.";
  }

  if (message.includes("Sign in failed")) {
    return "Login failed. Please check your email and password.";
  }

  if (message.length < 100 && !message.includes("/")) {
    return message;
  }

  return "Something went wrong. Please try again.";
};
