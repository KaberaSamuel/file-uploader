import { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:3000/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          setAuthenticatedUser(null);
          return;
        }

        const { user } = await response.json();
        setAuthenticatedUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setAuthenticatedUser(null);
      }
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
