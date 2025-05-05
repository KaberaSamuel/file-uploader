import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFolderClosed,
  faFileCirclePlus,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { apiUrl } from "../../service";
import { DashboardNavbar } from "./navbars.jsx";
import { useAuth } from "./AuthProvider.jsx";
import "../styles/App.css";

function Items({ folders }) {
  if (folders.length > 0) {
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

function SideBar({ user, setRevealFolderDialog }) {
  const [revealWorkspace, setRevealWorkspace] = useState(false);
  return (
    <div className="sidebar">
      <div className="links">
        <div
          onClick={() => {
            setRevealFolderDialog(true);
          }}
        >
          <FontAwesomeIcon className="icon" icon={faFolderPlus} />
          <p>New Folder</p>
        </div>

        <div>
          <FontAwesomeIcon className="icon" icon={faFileCirclePlus} />
          <p>New File</p>
        </div>
      </div>

      <div
        className={revealWorkspace ? "workspace reveal" : "workspace"}
        onClick={() => {
          setRevealWorkspace(!revealWorkspace);
        }}
      >
        <div className="user">
          <FontAwesomeIcon className="icon" icon={faChevronRight} />
          <p>{user.username}</p>
        </div>
      </div>
    </div>
  );
}

function Main({ user }) {
  console.log(user);
  // const { folders } = user;
  return (
    <div className="main">
      <p>{user.username}</p>
      {/* <Items folders={folders} /> */}
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
  const [revealFolderDialog, setRevealFolderDialog] = useState(false);

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="app">
      <DashboardNavbar />
      <div className="dashboard">
        <SideBar user={user} setRevealFolderDialog={setRevealFolderDialog} />
        <Main user={user} />
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
