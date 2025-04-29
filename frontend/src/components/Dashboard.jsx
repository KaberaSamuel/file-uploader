import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFileCirclePlus,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useOutletContext, Outlet } from "react-router-dom";
import { useState } from "react";

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
  const { folders } = user;

  return (
    <div className="main">
      <p>{user.username}</p>

      {
        <ul>
          <li className="header">
            <p>name</p>
            <p>size</p>
            <p>created</p>
          </li>
          {folders.map(({ id, name, date }) => (
            <li key={id}>
              <p>{name}</p>
              <p>--</p>
              <p>{date}</p>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}

function NewFolderDialog({ revealFolderDialog, setRevealFolderDialog }) {
  const [folder, setfolder] = useState("");

  async function submitFolder() {
    if (folder == "") {
      alert("the field is empty");
    } else {
      const response = await fetch("http://localhost:3000/auth/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      setfolder("");
      if (response.ok) {
        setRevealFolderDialog(false);
      }
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
  const user = useOutletContext();
  const [revealFolderDialog, setRevealFolderDialog] = useState(false);

  return (
    <div className="dashboard">
      <SideBar user={user} setRevealFolderDialog={setRevealFolderDialog} />
      <Main user={user} />
      <NewFolderDialog
        revealFolderDialog={revealFolderDialog}
        setRevealFolderDialog={setRevealFolderDialog}
      />
    </div>
  );
}

export default Dashboard;
