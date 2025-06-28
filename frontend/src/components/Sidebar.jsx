import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFileCirclePlus,
  faTrashCan,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { getFolderById, getAllFolderIds, getPathArray } from "../../service";
import { useAuth } from "./AuthProvider";
import "../styles/sidebar.css";

function SideBar({ setActiveModal, setShareItem }) {
  const isPublic = window.location.pathname.includes("public");

  // id of current folder
  const { dataTree } = useAuth();
  const { id } = useParams();
  const folderId = id ? Number(id) : 0;

  const [selectedItems, setSelectedItems] = useState([folderId]);
  const [expandedIds, setExpandedIds] = useState([]);

  // current folder in view
  const folder = getFolderById(folderId, dataTree);
  const pathArray = getPathArray(folder, dataTree);
  const defaultExpandedIds = pathArray.map((folder) => folder.id);

  const navigate = useNavigate();

  function getItemLabel(item) {
    return item.name;
  }

  // Sync selected and expanded items with current route
  useEffect(() => {
    setSelectedItems([folderId]);

    // Only merge valid folders that still exist in the tree (i.e., remove deleted folders)
    const visibleFolderIds = new Set(getAllFolderIds(dataTree));
    const validExpandedIds = defaultExpandedIds.filter((id) =>
      visibleFolderIds.has(id)
    );

    setExpandedIds((prev) => {
      const currentId = validExpandedIds.at(-1);
      const merged = new Set([...prev, ...validExpandedIds]);

      // removing the currentId if it was already expanded
      if (!expandedIds.includes(currentId)) {
        merged.delete(currentId);
      }

      return Array.from(merged);
    });
  }, [folderId, dataTree]);

  return (
    <div className="sidebar">
      <div className="links">
        <div
          onClick={() => {
            setActiveModal("create");
          }}
        >
          <FontAwesomeIcon className="icon" icon={faFolderPlus} />
          <p>New Folder</p>
        </div>

        <div
          onClick={() => {
            setActiveModal("upload-file");
          }}
        >
          <FontAwesomeIcon className="icon" icon={faFileCirclePlus} />
          <p>New File</p>
        </div>

        {id && (
          <div
            onClick={() => {
              setShareItem({ type: "folder", data: folder });
              setActiveModal("share-link");
            }}
          >
            <FontAwesomeIcon className="icon" icon={faShareNodes} />
            <p>Share Folder</p>
          </div>
        )}

        {id && (
          <div
            onClick={() => {
              setActiveModal("delete");
            }}
          >
            <FontAwesomeIcon className="icon" icon={faTrashCan} />
            <p>Delete Folder</p>
          </div>
        )}
      </div>

      <RichTreeView
        items={dataTree}
        getItemLabel={getItemLabel}
        selectedItems={selectedItems}
        onSelectedItemsChange={(event, ids) => setSelectedItems(ids)}
        expandedItems={expandedIds}
        onExpandedItemsChange={(event, ids) => setExpandedIds(ids)}
        onItemClick={(e, id) => {
          if (id === 0) {
            navigate("/folders");
          } else {
            navigate(`/folders/${id}`);
          }
        }}
        className="tree-view"
        multiSelect={false}
      />
    </div>
  );
}

export default SideBar;
