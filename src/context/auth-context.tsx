"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  accountType: "jobseeker" | "employer";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    accountType: "jobseeker" | "employer"
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Run only once on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []); // Empty dependency array

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    try {
      // Fake validation
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = storedUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid credentials");
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    accountType: "jobseeker" | "employer"
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const newUser = {
        id: `USER_${Date.now()}`,
        name,
        email,
        password,
        accountType,
      };

      // Store in "database" (localStorage)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Log user in
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
