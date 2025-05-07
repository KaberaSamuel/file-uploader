import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderClosed,
  faXmark,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Navigate, useLoaderData } from "react-router-dom";
import { useState } from "react";
import { apiUrl } from "../../service";
import { DashboardNavbar } from "./navbars.jsx";
import SideBar from "./Sidebar.jsx";
import { useAuth } from "./AuthProvider.jsx";
import Loader from "./Loader.jsx";
import "../styles/App.css";

function Items({ folders }) {
  if (folders && folders.length > 0) {
    return (
      <ul>
        <li className="header">
          <p>name</p>
          <p>size</p>
          <p>created</p>
        </li>
        {folders.map(({ id, name, date }) => (
          <li key={id}>
            <div>
              <FontAwesomeIcon className="icon" icon={faFolderClosed} />
              <p>{name}</p>
            </div>
            <p>--</p>
            <p>{date}</p>
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <div className="no-items">
        <p>No items yet</p>
      </div>
    );
  }
}

function FolderContent({ foldersTree, pathArray }) {
  const user = foldersTree[0];
  const { children } = user;
  const max = pathArray.length - 1;
  return (
    <div className="folder-content">
      <div className="path-bar">
        {pathArray.map(({ name, id }, index) => {
          if (index < max) {
            return (
              <div key={id}>
                <p>{name}</p>
                <FontAwesomeIcon className="icon" icon={faChevronRight} />
              </div>
            );
          } else {
            return <p key={id}>{name}</p>;
          }
        })}
      </div>
      <Items folders={children} />
    </div>
  );
}

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
  const { user } = useAuth();
  const foldersTree = useLoaderData();
  const navigate = useNavigate();
  const [revealFolderDialog, setRevealFolderDialog] = useState(false);

  // setting user as the first element in the array
  const [pathArray, setPathArray] = useState([foldersTree[0]]);

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
          setPathArray={setPathArray}
        />
        <FolderContent foldersTree={foldersTree} pathArray={pathArray} />
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
