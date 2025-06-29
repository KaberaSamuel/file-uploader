import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./components/AuthProvider";
import SideBar from "./components/Sidebar";
import Modal from "./components/Modal";
import FileInfo from "./components/FileInfo";
import Navbar from "./components/Navbar";
import "./styles/App.css";

function App() {
  // initial app data
  const { dataTree } = useAuth();
  const user = dataTree[0];

  // initializing app variables
  const [activeModal, setActiveModal] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [activeLink, setActiveLink] = useState(2);

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

      <FileInfo
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        setActiveModal={setActiveModal}
      />

      <Modal
        activeFile={activeFile}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
    </div>
  );
}

export default App;
