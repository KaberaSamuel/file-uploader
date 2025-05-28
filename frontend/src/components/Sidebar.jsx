import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFileCirclePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { getFolderById, getAllFolderIds, getPathArray } from "../../service";
import "../styles/sidebar.css";

function SideBar({ dataTree, setActiveModal }) {
  const { id } = useParams();
  const folderId = id ? Number(id) : 0;

  const [selectedItems, setSelectedItems] = useState([folderId]);
  const [expandedItems, setExpandedItems] = useState([]);
  const navigate = useNavigate();

  // current folder in view
  const folder = getFolderById(folderId, dataTree);
  const pathArray = getPathArray(folder, dataTree);
  const expandedItemIds = pathArray.map((folder) => folder.id);

  function getItemLabel(item) {
    return item.name;
  }

  // Sync selected and expanded items with current route
  useEffect(() => {
    setSelectedItems([folderId]);

    // Only merge valid folders that still exist in the tree
    const visibleFolderIds = new Set(getAllFolderIds(dataTree));

    const validPathIds = expandedItemIds.filter(
      (id) => !visibleFolderIds.has(id)
    );

    setExpandedItems((prev) => {
      const merged = new Set([...prev, ...validPathIds]);
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
        expandedItems={expandedItems}
        onExpandedItemsChange={(event, ids) => setExpandedItems(ids)}
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
