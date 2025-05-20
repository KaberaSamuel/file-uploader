import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useState } from "react";
import { apiUrl } from "../service.js";
import { DashboardNavbar } from "./components/navbars.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import { useLoader } from "./components/LoadingContext.jsx";
import SideBar from "./components/Sidebar.jsx";
import Loader from "./components//Loader.jsx";
import { createDataTree } from "../service.js";
import "./styles/App.css";

// showing dialog form for creating new folder
function Modal({ dialog, setDialog }) {
  const { setDataTree } = useAuth();

  const [folder, setfolder] = useState("");
  const { id } = useParams();

  async function submitFolder(e) {
    e.preventDefault();
    if (folder == "") {
      alert("the field is empty");
    } else {
      const response = await fetch(`${apiUrl}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: folder,
          parentId: id ? Number(id) : null,
        }),
        credentials: "include",
      });
      const newUser = await response.json();
      const newDataTree = createDataTree(newUser);
      setDataTree(newDataTree);
      setfolder("");
      if (response.ok) {
        setDialog(false);
      }
    }
  }

  return (
    <dialog
      className={dialog ? "reveal" : ""}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <form onSubmit={submitFolder}>
        <div className="first">
          <p>New Folder</p>
          <FontAwesomeIcon
            className="icon"
            icon={faXmark}
            onClick={() => {
              setDialog(false);
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

        <button type="submit">Create Folder</button>
      </form>
    </dialog>
  );
}

function App() {
  // starting tree data
  const { dataTree } = useAuth();
  const { isLoading } = useLoader();

  // variables for form dialog
  const [dialog, setDialog] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  const user = dataTree[0];
  if (!user) {
    return <Navigate to="/login" />;
  }

  function hideDialog() {
    setDialog(false);
  }

  return (
    <div className="app" onClick={hideDialog}>
      <DashboardNavbar />

      <div className="dashboard">
        <SideBar dataTree={dataTree} setDialog={setDialog} />

        <Outlet />
        <Modal dialog={dialog} setDialog={setDialog} user={user} />
      </div>
    </div>
  );
}

export default App;
