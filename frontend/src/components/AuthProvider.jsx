import { createContext, useEffect, useState, useContext } from "react";
import { fetchUserData } from "../../service";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function () {
      // lazily loading data for better user experience
      setTimeout(async () => {
        const newUser = await fetchUserData();
        setUser(newUser);
        setIsLoading(false);
      }, 1000);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
