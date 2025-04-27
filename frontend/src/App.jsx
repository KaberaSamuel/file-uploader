import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./components/AuthProvider.jsx";

function App() {
  const { authenticatedUser } = useAuth();
  console.log("from app.jsx: ", authenticatedUser);

  if (!authenticatedUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default App;
