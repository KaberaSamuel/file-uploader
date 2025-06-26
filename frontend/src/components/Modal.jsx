import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
    <form
      onSubmit={deleteFolder}
      className="delete-folder"
      style={{ lineHeight: "2rem", fontSize: "1.1rem" }}
    >
      <div className="first">
        <p>Delete Folder</p>
        <FontAwesomeIcon
          className="icon"
          icon={faXmark}
          onClick={() => {
            setActiveModal(null);
          }}
        />
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
        <input
          type="file"
          accept=".txt,.doc,.docx,.pdf,.rtf,.png,.jpg,.jpeg,.mp3"
          onChange={onFileChange}
        />
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

function ShareLink({ shareItem, activeLink, setActiveLink, setActiveModal }) {
  const listRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [link, setLink] = useState(null);
  const [copied, setCopied] = useState(false);

  let linkButton;
  if (pending) {
    linkButton = (
      <button>
        <div className="pending"></div>
      </button>
    );
  } else if (link) {
    if (copied) {
      linkButton = <button>Copied</button>;
    } else {
      linkButton = (
        <button
          onClick={() => {
            navigator.clipboard.writeText(link);
            setCopied(true);
          }}
        >
          Copy
        </button>
      );
    }
  } else {
    linkButton = (
      <button
        className="Generate Link"
        onClick={() => {
          generateLink();
        }}
      >
        Generate Link
      </button>
    );
  }

  function updateButtons() {
    const listNode = listRef.current;
    const allNodes = listNode.querySelectorAll("p");

    allNodes.forEach((element, index) => {
      if (index === activeLink) {
        element.classList.add("active");
      } else {
        element.classList.remove("active");
      }
    });
  }

  async function generateLink() {
    setPending(true);
    let duration;

    if (activeLink == 0) {
      // 1 hour
      duration = 3600;
    } else if (activeLink == 1) {
      // 4 hours
      duration = 3600 * 4;
    } else if (activeLink == 3) {
      // 3 days
      duration = 3 * 24 * 3600;
    } else if (activeLink == 4) {
      duration = 7 * 24 * 3600;
    } else {
      // 1 day
      duration = 24 * 3600;
    }

    const response = await fetch(`${apiUrl}/share-link`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shareItem,
        duration: duration,
      }),
      credentials: "include",
    });

    const url = await response.json();
    alert(url);
    setLink(url);
    setPending(false);
  }

  useEffect(() => {
    updateButtons();
  }, [activeLink]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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

      <p>Generate a public link to share the selected file</p>

      <div className="links-duration">
        <h1>Duration</h1>

        <div className="durations" ref={listRef}>
          <p
            onClick={() => {
              setActiveLink(0);
            }}
          >
            1 hour
          </p>
          <p
            onClick={() => {
              setActiveLink(1);
            }}
          >
            4 hour
          </p>
          <p
            onClick={() => {
              setActiveLink(2);
            }}
          >
            1 day
          </p>
          <p
            onClick={() => {
              setActiveLink(3);
            }}
          >
            3 days
          </p>
          <p
            onClick={() => {
              setActiveLink(4);
            }}
          >
            1 week
          </p>
        </div>

        <p>Links will expire after the specified duration</p>

        {link && <input value={link} readOnly />}
      </div>

      <div className="buttons">
        <button
          type="button"
          className="cancel"
          onClick={() => setActiveModal(null)}
        >
          Cancel
        </button>
        {linkButton}
      </div>
    </div>
  );
}

function Modal({
  shareItem,
  activeLink,
  activeModal,
  setActiveLink,
  setActiveModal,
}) {
  return (
    <AnimatePresence>
      {activeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="modal-backdrop reveal"
          onClick={() => {
            setActiveModal(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{
              duration: 0.2,
            }}
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
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

            {activeModal === "share-link" && (
              <ShareLink
                shareItem={shareItem}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                setActiveModal={setActiveModal}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
