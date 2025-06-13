import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, spring } from "framer-motion";
import { apiUrl, extractData, getFolderById } from "../../service";
import { useAuth } from "./AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function CreateFolder({ setActiveModal }) {
  const { id } = useParams();
  const { dataTree, setDataTree } = useAuth();
  const { userId, name } = dataTree[0];

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
        userId: userId,
        username: name,
      }),
      credentials: "include",
    });

    const newDataTree = await extractData(response);

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
        userId: dataTree[0].userId,
      }),
    });

    const newDataTree = await extractData(response);

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
        <FontAwesomeIcon className="icon" icon={faXmark} onClick={() => {setActiveModal(null)}} />
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
  const { id } = useParams();
  const { dataTree, setDataTree } = useAuth();
  const [pending, setPending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { name, userId } = dataTree[0];

  function onFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function uploadFile(e) {
    try {
      e.preventDefault();
      setPending(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("parentFolderId", id ? id : null);
      formData.append("userId", userId);
      formData.append("username", name);

      const response = await fetch(`${apiUrl}/files`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const newDataTree = await extractData(response);
        setDataTree(newDataTree);
      }

      if (response.status == 400) {
        alert("Please choose a file");
      }

      // updating UI
      setPending(false);
      setActiveModal(null);
    } catch {
      setPending(false);
      setActiveModal(null);
    }
  }

  return (
    <form onSubmit={uploadFile}>
      <div className="first">
        <p>New File</p>
        <FontAwesomeIcon
          className="icon"
          icon={faXmark}
          onClick={() => {
            setActiveModal(null);
          }}
        />
      </div>

      <div>
        <input type="file" accept=".txt,.doc,.docx,.pdf,.rtf,.png,.jpg,.jpeg,.mp3" onChange={onFileChange} />
      </div>

      {pending ? (
        <button disabled>
          <div className="pending"></div>
        </button>
      ) : (
        <button type="submit">Upload</button>
      )}
    </form>
  );
}

function Modal({ activeModal, setActiveModal }) {
  return (
    <AnimatePresence>
      {activeModal && <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{duration: 0.2}}

      className="modal-backdrop reveal"
      onClick={() => {
        setActiveModal(null);
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        transition={{
          type: "spring",
          duration: 0.3
        }}

        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%'
        }}

        className="modal"
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
      </motion.div>
    </motion.div>}
    </AnimatePresence>
  );
}

export default Modal;
