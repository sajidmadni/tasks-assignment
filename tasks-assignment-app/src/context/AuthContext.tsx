import { createContext, useState, useEffect } from "react";

// Define types for the context
interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  setAuth: (auth: { token: string }) => void;
  logout: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuthState] = useState<{ token: string | null;  }>({
    token: localStorage.getItem("token")
  });

  // Function to update auth state
  const setAuth = (authData: { token: string;  }) => {
    localStorage.setItem("token", authData.token);
    setAuthState(authData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({ token: null});
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
