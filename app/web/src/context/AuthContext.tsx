import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { LOCAL_IP, SERVER_IP } from "../config";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pfp?: string;
  isVerified: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    // UI Persistence: Only used to show the name/pfp while we verify the session
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 1. Silent Refresh / Auto-Login on mount
  useEffect(() => {
    const refreshAccess = async () => {
      try {
        const response = await fetch(`${LOCAL_IP}/api/auth/token`, {
          method: "POST",
          credentials: "include", // Required to send the HTTPOnly refreshToken cookie
        });

        if (response.ok) {
          const data = await response.json();
          // Ideally, your backend /token endpoint should also return the user object
          // to ensure the frontend state stays perfectly synced with the DB
          setToken(data.accessToken);
          if (data.user) {
            setUser(data.user);

            localStorage.setItem("user_data", JSON.stringify(data.user));
          }
        } else {
          // Cookie expired or invalid
          logout();
        }
      } catch (err) {
        console.error("Silent refresh failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    refreshAccess();
  }, []);

  const login = (userData: User, accessToken: string) => {
    setToken(accessToken); // Store in memory only (Safe from XSS)
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Tell backend to delete the Refresh Token from DB and clear the cookie
      await fetch(`${LOCAL_IP}/api/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("user_data");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        login,
        logout,
        isLoggedIn: !!user,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
