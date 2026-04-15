import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Types
type User = {
  id: string;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Decode token to get user info
  const decodeToken = (token: string): User | null => {
    try {
      const decoded: any = jwtDecode(token);
      console.log("Decoded token:", decoded); // 👈 شوف الـ token فيه ايه
      
      return {
        id: decoded.id || decoded.userId || decoded.sub,
        email: decoded.email,
        role: decoded.role || "user", // 👈 خلي default "user" مش "admin"
        name: decoded.name,
        avatar: decoded.avatar,
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  // Load token and decode on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const userData = decodeToken(storedToken);
      setUser(userData);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const userData = decodeToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === "admin"; // 👈 مقارنة صحيحة
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}