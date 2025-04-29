import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./components/AuthProvider.jsx";
import Loader from "./components/Loader.jsx";
import { DashboardNavbar } from "./components/navbars.jsx";
import "./styles/App.css";

function App() {
  const { user, isLoadingData } = useAuth();

  if (isLoadingData) {
    return <Loader />;
  } else if (user) {
    return (
      <div className="app">
        <DashboardNavbar />
        <Outlet context={user} />
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;
