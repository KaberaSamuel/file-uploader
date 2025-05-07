import { Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthProvider.jsx";
import Loader from "./components/Loader.jsx";
import "./styles/App.css";

function App() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Navigate to="/folders" />;
}
export default App;
