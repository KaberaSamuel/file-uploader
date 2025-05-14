import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useNavigate, useParams } from "react-router-dom";
import { getFolderById, getPathArray } from "../../service";
import "../styles/sidebar.css";

function SideBar({ dataTree, setRevealFolderDialog }) {
  const { id } = useParams();
  const folderId = id ? Number(id) : 0;
  const folder = getFolderById(folderId, dataTree);
  const pathArray = getPathArray(folder, dataTree);
  const expandedItemIds = pathArray.map((folder) => folder.id);

  const navigate = useNavigate();
  function getItemLabel(item) {
    return item.name;
  }

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

      <RichTreeView
        items={dataTree}
        defaultSelectedItems={[folderId]}
        defaultExpandedItems={expandedItemIds}
        getItemLabel={getItemLabel}
        onItemClick={async (e, id) => {
          if (id == 0) {
            navigate("/folders");
          } else {
            navigate(`/folders/${id}`);
          }
        }}
        multiSelect
      />
    </div>
  );
}

export default SideBar;
