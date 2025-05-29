import { createContext, useState, useEffect, useContext } from "react";
import { useLoader } from "./LoadingContext";
import { apiUrl, extractData } from "../../service";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [dataTree, setDataTree] = useState([null]);
  const { setIsLoading } = useLoader();

  useEffect(() => {
    (async function () {
      const response = await fetch(`${apiUrl}/folders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const userDataTree = await extractData(response);
      setDataTree(userDataTree);
      setIsLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ dataTree, setDataTree, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
