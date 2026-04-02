import { createContext, useContext, useState, type ReactNode } from "react";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  pfp?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

/*export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); */

// hardcoded user for testing remove when done
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // check if a real user is saved from a previous login
    const savedUser = localStorage.getItem("user_data");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (err) {
        console.error("Error parsing saved user", err);
      }
    }

    // if no saved user, return the Test User
    return {
      firstName: "Test",
      lastName: "User",
      email: "test@ucf.edu",
      pfp: "",
    };
  });

  const login = (userData: User, token: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user_data", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user_data");

    //user logged out
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, isLoggedIn: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
