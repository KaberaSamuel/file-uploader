import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./components/AuthProvider";
import SideBar from "./components/Sidebar";
import Modal from "./components/Modal";
import FileInfo from "./components/FileInfo";
import Navbar from "./components/Navbar";
import "./styles/App.css";

function App() {
  // starting data
  const { dataTree } = useAuth();

  // modal's variables
  const [activeModal, setActiveModal] = useState(null);
  const user = dataTree[0];

  // active file variable
  const [activeFile, setActiveFile] = useState(null);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app">
      <Navbar />

      <div className="dashboard">
        <SideBar dataTree={dataTree} setActiveModal={setActiveModal} />
        <Outlet context={{ activeFile, setActiveFile }} />
      </div>

      <FileInfo activeFile={activeFile} setActiveFile={setActiveFile} />

      <Modal activeModal={activeModal} setActiveModal={setActiveModal} />
    </div>
  );
}

export default App;
