import { useState, useEffect } from "react";
import { User, SignUpForm } from "@/types";

const STORAGE_KEY = "skilr_auth";
const USERS_KEY = "skilr_users";

interface StoredUser extends User {
  password: string;
}

interface AuthState {
  isLoggedIn: boolean;
  currentUserId: string | null;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authState = localStorage.getItem(STORAGE_KEY);
    if (authState) {
      const { isLoggedIn: loggedIn, currentUserId } = JSON.parse(
        authState
      ) as AuthState;
      if (loggedIn && currentUserId) {
        const users = getStoredUsers();
        const foundUser = users.find((u) => u.email === currentUserId);
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          setIsLoggedIn(true);
        }
      }
    }
    setLoading(false);
  }, []);

  const getStoredUsers = (): StoredUser[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveStoredUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const saveAuthState = (loggedIn: boolean, userId: string | null) => {
    const authState: AuthState = {
      isLoggedIn: loggedIn,
      currentUserId: userId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
  };

  const signUp = (form: SignUpForm) => {
    const firstName = form.firstName || "John";
    const lastName = form.lastName || "Doe";
    const email = form.email || `johndoe@domain.com`;
    const phone = form.phone || "+234 800 000 0000";
    const password = form.password || "johndoe123";

    const users = getStoredUsers();

    if (form.email && users.find((u) => u.email === email)) {
      alert("An account with this email already exists");
      return;
    }

    const newUser: StoredUser = {
      firstName,
      lastName,
      email,
      phone,
      password,
    };

    users.push(newUser);
    saveStoredUsers(users);

    const { password: pwd, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsLoggedIn(true);
    saveAuthState(true, newUser.email);
  };

  const signIn = (email: string, password: string) => {
    if (!email && !password) {
      const demoUser: User = {
        firstName: "John",
        lastName: "Doe",
        email: `johndoe@domain.com`,
        phone: "+234 800 000 0000",
      };
      setUser(demoUser);
      setIsLoggedIn(true);
      saveAuthState(true, demoUser.email);
      return;
    }

    const users = getStoredUsers();
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      alert("Invalid email or password");
      return;
    }

    const { password: pwd, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    setIsLoggedIn(true);
    saveAuthState(true, foundUser.email);
  };

  const signOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    saveAuthState(false, null);
  };

  const updateUser = (updatedUser: User) => {
    if (!user) return;

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.email === user.email);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...updatedUser,
      };
      saveStoredUsers(users);
      setUser(updatedUser);
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!user) return;

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.email === user.email);

    if (userIndex === -1) {
      alert("User not found");
      throw new Error("User not found");
    }

    users[userIndex].password = newPassword || "demo123";
    saveStoredUsers(users);
    alert("Password updated successfully!");
  };

  const getCurrentUserId = () => {
    return user?.email || null;
  };

  return {
    isLoggedIn,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUser,
    updatePassword,
    getCurrentUserId,
  };
};
