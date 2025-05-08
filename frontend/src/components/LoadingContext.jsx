import { createContext, useState, useContext } from "react";

const loaderContext = createContext();

function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <loaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </loaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(loaderContext);
}

export default LoaderProvider;
