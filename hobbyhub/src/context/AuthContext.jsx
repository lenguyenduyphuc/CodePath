import { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user already has an ID in localStorage
    const storedUserId = localStorage.getItem("forumUserId");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Generate a new random user ID
      const newUserId = uuidv4();
      localStorage.setItem("forumUserId", newUserId);
      setUserId(newUserId);
    }

    setIsLoading(false);
  }, []);

  const value = {
    userId,
    isLoading,
    isAuthenticated: !!userId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
