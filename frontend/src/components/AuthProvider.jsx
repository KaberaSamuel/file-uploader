import { createContext, useState, useEffect, useContext } from "react";
import { useLoader } from "./LoadingContext";
import { getDataTree } from "../../service";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [dataTree, setDataTree] = useState([null]);
  const { setIsLoading } = useLoader();

  useEffect(() => {
    (async function () {
      // lazily loading dataTree for better user experience
      setTimeout(async () => {
        const userDataTree = await getDataTree();
        setDataTree(userDataTree);
        setIsLoading(false);
      }, 1000);
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
