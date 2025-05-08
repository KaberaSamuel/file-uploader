import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { apiUrl } from "../service.js";
import { DashboardNavbar } from "./components/navbars.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import { useLoader } from "./components/LoadingContext.jsx";
import SideBar from "./components/Sidebar.jsx";
import Loader from "./components//Loader.jsx";
import "./styles/App.css";

function NewFolderDialog({ revealFolderDialog, setRevealFolderDialog, user }) {
  const [folder, setfolder] = useState("");
  const navigate = useNavigate();

  async function submitFolder() {
    if (folder == "") {
      alert("the field is empty");
    } else {
      setfolder("");
      const response = await fetch(`${apiUrl}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: folder, id: user.id }),
      });
      if (response.ok) {
        setRevealFolderDialog(false);
      }
      navigate(0);
    }
  }

  return (
    <dialog className={revealFolderDialog ? "reveal" : ""}>
      <div className="first">
        <p>New Folder</p>
        <FontAwesomeIcon
          className="icon"
          icon={faXmark}
          onClick={() => {
            setRevealFolderDialog(false);
          }}
        />
      </div>

      <div>
        <p>Name</p>
        <input
          type="text"
          value={folder}
          onChange={(e) => {
            setfolder(e.target.value);
          }}
        />
      </div>

      <button onClick={submitFolder}>Create Folder</button>
    </dialog>
  );
}

function App() {
  // starting tree data
  const { dataTree } = useAuth();
  const { isLoading } = useLoader();

  // variables for form dialog
  const [revealFolderDialog, setRevealFolderDialog] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  const user = dataTree[0];
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app">
      <DashboardNavbar />

      <div className="dashboard">
        <SideBar
          dataTree={dataTree}
          setRevealFolderDialog={setRevealFolderDialog}
        />

        <Outlet />
        <NewFolderDialog
          revealFolderDialog={revealFolderDialog}
          setRevealFolderDialog={setRevealFolderDialog}
          user={user}
        />
      </div>
    </div>
  );
}

export default App;
