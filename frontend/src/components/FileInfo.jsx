import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "./AuthProvider";
import { extractData, apiUrl } from "../../service";

function FileInfo({ activeFile, setActiveFile, setActiveModal }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { dataTree, setDataTree } = useAuth();

  async function deleteFile(e) {
    e.preventDefault();
    setIsDeleting(true);

    const response = await fetch(`${apiUrl}/files`, {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        fileId: activeFile.id,
        filename: activeFile.originalName,
        userId: dataTree[0].userId,
      }),
    });

    const newDataTree = await extractData(response);

    // updating UI
    setIsDeleting(false);
    setDataTree(newDataTree);
    setActiveFile(null);
  }

  return (
    <AnimatePresence>
      {activeFile && (
        <div className="file-info-backdrop" onClick={() => setActiveFile(null)}>
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              duration: 0.3,
            }}
            className="file-info"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="header">
              <p>File Information</p>
              <FontAwesomeIcon
                className="icon"
                icon={faXmark}
                onClick={() => {
                  setActiveFile(null);
                }}
              />
            </div>

            <div className="middle">
              <p>
                <span>Name: </span> {activeFile.name}
              </p>
              <p>
                <span>Type: </span> {activeFile.type}
              </p>
              <p>
                <span>Size: </span> {activeFile.convertedSize}
              </p>
              <p>
                <span>Created: </span> {activeFile.created_at}
              </p>
            </div>

            <div className="buttons">
              <button
                onClick={() => {
                  setActiveFile(null);
                }}
              >
                Close
              </button>

              <button onClick={() => setActiveModal("share-link")}>
                Share
              </button>

              {isDeleting ? (
                <button>
                  <div className="pending"></div>
                </button>
              ) : (
                <button className="delete" onClick={deleteFile}>
                  Delete
                </button>
              )}

              <button>Download</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default FileInfo;
