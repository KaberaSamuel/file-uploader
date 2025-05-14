import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
// import { useNavigate } from "react-router-dom";
// import { getFolderById } from "../../service";
import TreeView from "./TreeView";
import "../styles/sidebar.css";

function SideBar({ dataTree, setRevealFolderDialog }) {
  // const navigate = useNavigate();

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

      <div>
        <TreeView data={dataTree} />
      </div>
    </div>
  );
}

export default SideBar;
