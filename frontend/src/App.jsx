import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./components/AuthProvider";
import SideBar from "./components/Sidebar"
import Modal from "./components/Modal";
import Navbar from "./components/Navbar";
import "./styles/App.css";

function App() {
  // starting data
  const { dataTree } = useAuth();

  // modal's variables
  const [activeModal, setActiveModal] = useState(null);
  const user = dataTree[0];

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app">
      <Navbar />

      <div className="dashboard">
        <SideBar dataTree={dataTree} setActiveModal={setActiveModal} />
        <Outlet />
      </div>

      <Modal activeModal={activeModal} setActiveModal={setActiveModal} />
    </div>
  );
}

export default App;
