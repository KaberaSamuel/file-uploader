import { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext();

async function fetchUserData() {
  try {
    const response = await fetch("http://localhost:3000/auth/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const { message } = await response.json();
      console.log(message);
      return null;
    }

    const { user } = await response.json();
    return user;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    (async function () {
      // lazily loading data for better user experience
      setTimeout(async () => {
        const newUser = await fetchUserData();
        setUser(newUser);
        setIsLoadingData(false);
      }, 1000);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoadingData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
