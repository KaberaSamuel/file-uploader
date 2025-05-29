import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./components/AuthProvider";
import { useLoader } from "./components/LoadingContext";
import SideBar from "./components/Sidebar";
import Loader from "./components//Loader";
import Modal from "./components/Modal";
import Navbar from "./components/navbar";
import "./styles/App.css";

function App() {
  // starting data
  const { dataTree } = useAuth();
  const { isLoading } = useLoader();

  // modal's variables
  const [activeModal, setActiveModal] = useState(null);
  const user = dataTree[0];

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  console.log(user.files);

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
