import { createContext, useState, useEffect, useContext } from "react";
import { apiUrl, extractData } from "../../service";
import Loader from "./Loader";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [dataTree, setDataTree] = useState([null]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(window.location.pathname);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ dataTree, setDataTree }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
