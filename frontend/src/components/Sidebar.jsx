import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFileCirclePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
  createDataTree,
  getFolderById,
  getAllFolderIds,
  getPathArray,
  apiUrl,
} from "../../service";
import { useAuth } from "./AuthProvider";
import { useLoader } from "./LoadingContext";
import Loader from "./Loader";
import "../styles/sidebar.css";

function SideBar({ dataTree, setDialog }) {
  const { id } = useParams();
  const folderId = id ? Number(id) : 0;

  const [selectedItems, setSelectedItems] = useState([folderId]);
  const [expandedItems, setExpandedItems] = useState([]);

  const navigate = useNavigate();

  // current folder in view
  const folder = getFolderById(folderId, dataTree);
  const pathArray = getPathArray(folder, dataTree);
  const expandedItemIds = pathArray.map((folder) => folder.id);

  const { setDataTree } = useAuth();
  const { isLoading, setIsLoading } = useLoader();

  function getItemLabel(item) {
    return item.name;
  }

  async function deleteFolder() {
    setIsLoading(true);

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
    const newTree = createDataTree(user);
    setDataTree(newTree);
    setIsLoading(false);
    navigate(link);
  }

  // Sync selected and expanded items with current route
  useEffect(() => {
    setSelectedItems([folderId]);

    // Only merge valid folders that still exist in the tree
    const visibleFolderIds = new Set(getAllFolderIds(dataTree));

    const validPathIds = expandedItemIds.filter((id) =>
      visibleFolderIds.has(id)
    );

    setExpandedItems((prev) => {
      const merged = new Set([...prev, ...validPathIds]);
      return Array.from(merged);
    });
  }, [folderId, dataTree]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="sidebar">
      <div className="links">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setDialog(true);
          }}
        >
          <FontAwesomeIcon className="icon" icon={faFolderPlus} />
          <p>New Folder</p>
        </div>

        <div>
          <FontAwesomeIcon className="icon" icon={faFileCirclePlus} />
          <p>New File</p>
        </div>

        {id && (
          <div onClick={deleteFolder}>
            <FontAwesomeIcon className="icon" icon={faTrashCan} />
            <p>Delete Folder</p>
          </div>
        )}
      </div>

      <RichTreeView
        items={dataTree}
        selectedItems={selectedItems}
        onSelectedItemsChange={(event, ids) => setSelectedItems(ids)}
        expandedItems={expandedItems}
        onExpandedItemsChange={(event, ids) => setExpandedItems(ids)}
        getItemLabel={getItemLabel}
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
