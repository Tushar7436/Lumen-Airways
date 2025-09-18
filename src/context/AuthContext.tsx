"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  recipientEmail: string | null;
  login: (jwt: string, userId: string, userName: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string | null>(null);

  // Load from localStorage on first render
  useEffect(() => {
    const jwt = localStorage.getItem("jwt_token");
    const storedId = localStorage.getItem("user_id");
    const storedName = localStorage.getItem("user_name");
    const storedEmail = localStorage.getItem("recipientEmail");

    if (jwt && storedId && storedName) {
      setIsLoggedIn(true);
      setUserId(storedId);
      setUserName(storedName);
      setRecipientEmail(storedEmail);
    }
  }, []);

  const login = (jwt: string, userId: string, userName: string, email: string) => {
    localStorage.setItem("jwt_token", jwt);
    localStorage.setItem("user_id", userId);
    localStorage.setItem("user_name", userName);
    localStorage.setItem("recipientEmail", email);

    setIsLoggedIn(true);
    setUserId(userId);
    setUserName(userName);
    setRecipientEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("recipientEmail");

    setIsLoggedIn(false);
    setUserId(null);
    setUserName(null);
    setRecipientEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, userName, recipientEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
