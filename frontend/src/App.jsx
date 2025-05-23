import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { DashboardNavbar } from "./components/navbars.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import { useLoader } from "./components/LoadingContext.jsx";
import SideBar from "./components/Sidebar.jsx";
import Loader from "./components//Loader.jsx";
import Modal from "./components/Modal.jsx";

import "./styles/App.css";

function App() {
  // starting data
  const { dataTree } = useAuth();
  const { isLoading } = useLoader();

  // modal's variables
  const [activeModal, setActiveModal] = useState(null);

  if (isLoading) {
    return <Loader />;
  }

  const user = dataTree[0];
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div
      className="app"
      onClick={() => {
        setActiveModal(null);
      }}
    >
      <DashboardNavbar />

      <div className="dashboard">
        <SideBar dataTree={dataTree} setActiveModal={setActiveModal} />
        <Outlet />
      </div>

      <Modal activeModal={activeModal} setActiveModal={setActiveModal} />
    </div>
  );
}

export default App;
