import { act, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./components/AuthProvider";
import SideBar from "./components/Sidebar";
import Modal from "./components/Modal";
import FileInfo from "./components/FileInfo";
import Navbar from "./components/Navbar";
import "./styles/App.css";

function App() {
  // initial app data
  const {
    dataTree: [user],
  } = useAuth();

  // initializing app variables
  const [activeModal, setActiveModal] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [activeLink, setActiveLink] = useState(2);
  const [shareItem, setShareItem] = useState(null);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app">
      <Navbar />

      <div className="dashboard">
        <SideBar setActiveModal={setActiveModal} setShareItem={setShareItem} />
        <Outlet context={{ activeFile, setActiveFile }} />
      </div>

      <FileInfo
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        setActiveModal={setActiveModal}
        setShareItem={setShareItem}
      />

      <Modal
        activeFile={activeFile}
        activeLink={activeLink}
        activeModal={activeModal}
        shareItem={shareItem}
        setActiveLink={setActiveLink}
        setActiveModal={setActiveModal}
      />
    </div>
  );
}

export default App;
