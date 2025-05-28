import { useState } from "react";
import { useParams, useNavigate, Form } from "react-router-dom";
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
            setActiveModal(null);
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

  async function deleteFolder(e) {
    e.preventDefault();
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
    <form onSubmit={deleteFolder}>
      <div className="first">
        <p>Delete Folder</p>
        <FontAwesomeIcon className="icon" icon={faXmark} />
      </div>

      <p>
        Are you sure you want to delete the current folder and all of its
        contents?
      </p>

      <div className="buttons">
        <button
          type="button"
          className="cancel"
          onClick={() => setActiveModal(null)}
        >
          Cancel
        </button>

        {pending ? (
          <button>
            <div className="pending"></div>
          </button>
        ) : (
          <button className="delete" type="submit">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

function AddFile({ setActiveModal }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  async function uploadFile(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    await fetch(`${apiUrl}/files`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  }

  return (
    <form onSubmit={uploadFile}>
      <div className="first">
        <p>New Folder</p>
        <FontAwesomeIcon
          className="icon"
          icon={faXmark}
          onClick={() => {
            setActiveModal(null);
          }}
        />
      </div>

      <div>
        <input type="file" onChange={onFileChange} />
      </div>

      <button type="submit">Upload</button>
    </form>
  );
}

function Modal({ activeModal, setActiveModal }) {
  return (
    <div
      className={activeModal ? "modal-backdrop reveal" : "modal-backdrop"}
      onClick={() => {
        setActiveModal(null);
      }}
    >
      <div
        className={activeModal ? "reveal dialog" : "dialog"}
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

        {activeModal === "upload-file" && (
          <AddFile setActiveModal={setActiveModal} />
        )}
      </div>
    </div>
  );
}

export default Modal;
