import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Navigate, useLoaderData, Outlet } from "react-router-dom";
import { useState } from "react";
import { apiUrl } from "../../service.js";
import { DashboardNavbar } from "./navbars.jsx";
import { FolderView } from "./FolderItem.jsx";
import { useAuth } from "./AuthProvider.jsx";
import SideBar from "./Sidebar.jsx";
import Loader from "./Loader.jsx";
import "../styles/App.css";

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

function Dashboard() {
  // starting variables
  const { user } = useAuth();
  const foldersTree = useLoaderData();
  const navigate = useNavigate();

  // tracking form dialog for new folder
  const [revealFolderDialog, setRevealFolderDialog] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (navigate.state == "loading") {
    return <Loader />;
  }

  return (
    <div>
      <DashboardNavbar />

      <div className="dashboard">
        <SideBar
          foldersTree={foldersTree}
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

export default Dashboard;
