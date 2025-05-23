import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl, createDataTree, getFolderById } from "../../service";
import { useAuth } from "./AuthProvider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function CreateFolder({ setActiveModal }) {
  const { id } = useParams();
  const { setDataTree } = useAuth();

  const [pending, setPending] = useState(false);
  const [folder, setFolder] = useState("");

  async function submitFolder(e) {
    e.preventDefault();
    setPending(true);
    const response = await fetch(`${apiUrl}/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder: folder ? folder : "New Folder",
        parentId: id ? Number(id) : null,
      }),
      credentials: "include",
    });

    const newUser = await response.json();
    const newDataTree = createDataTree(newUser);

    // updating UI
    setActiveModal(null);
    setPending(false);
    setFolder("");
    setDataTree(newDataTree);
  }

  return (
    <form onSubmit={submitFolder}>
      <div className="first">
        <p>New Folder</p>
        <FontAwesomeIcon
          className="icon"
          icon={faXmark}
          onClick={() => {
            setRevealModal(false);
          }}
        />
      </div>

      <div>
        <p>Name</p>
        <input
          type="text"
          value={folder}
          onChange={(e) => {
            setFolder(e.target.value);
          }}
        />
      </div>

      {pending ? (
        <button disabled>
          <div className="pending"></div>
        </button>
      ) : (
        <button type="submit">Create Folder</button>
      )}
    </form>
  );
}

function DeleteFolder({ setActiveModal }) {
  const { dataTree, setDataTree } = useAuth();
  const navigate = useNavigate();

  // folder to delete
  const { id } = useParams();
  const folderId = id ? Number(id) : 0;
  const folder = getFolderById(folderId, dataTree);

  const [pending, setPending] = useState(false);

  async function deleteFolder() {
    setPending(true);
    // link to navigate to after deleting
    const link = folder.parent_id ? `/folders/${folder.parent_id}` : "/folders";
    const response = await fetch(`${apiUrl}/folders`, {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        folder: folder,
      }),
    });

    const user = await response.json();
    const newDataTree = createDataTree(user);

    // updating UI
    setPending(false);
    setActiveModal(null);
    setDataTree(newDataTree);
    navigate(link);
  }

  return (
    <>
      <div className="first">
        <p>Delete Folder</p>
        <FontAwesomeIcon className="icon" icon={faXmark} />
      </div>

      <p>
        Are you sure you want to delete the current folder and all of its
        contents?
      </p>

      <div className="buttons">
        <button className="cancel" onClick={() => setActiveModal(null)}>
          Cancel
        </button>
        {pending ? (
          <button>
            <div className="pending"></div>
          </button>
        ) : (
          <button className="delete" onClick={deleteFolder}>
            Delete
          </button>
        )}
      </div>
    </>
  );
}

function Modal({ activeModal, setActiveModal }) {
  return (
    <dialog
      className={activeModal ? "reveal" : ""}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {activeModal === "create" && (
        <CreateFolder setActiveModal={setActiveModal} />
      )}
      {activeModal === "delete" && (
        <DeleteFolder setActiveModal={setActiveModal} />
      )}
    </dialog>
  );
}

export default Modal;
