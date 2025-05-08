import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function SideBar({ foldersTree, setRevealFolderDialog }) {
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

      <div className="folders-tree">
        <RichTreeView
          items={foldersTree}
          getItemLabel={getItemLabel}
          onItemClick={async (e, id) => {
            if (id == 0) {
              navigate("/folders");
            } else {
              navigate(`/folders/${id}`);
            }
          }}
        />
      </div>
    </div>
  );
}

export default SideBar;
