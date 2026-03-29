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
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

/*export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); */

  // hardcoded user for testing remove when done
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>({
  firstName: "Test",
  lastName: "User", 
  email: "test@ucf.edu",
});

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}