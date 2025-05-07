import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import "../styles/sidebar.css";

function getFolderById(id, folders) {
  for (const folder of folders) {
    if (folder.id === id) {
      return folder;
    }

    if (folder.children) {
      const found = getFolderById(id, folder.children);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function generatePathArray(currentFolder, foldersTree) {
  let pathArray = [];

  function buildArray(folder, tree) {
    pathArray.push(folder);

    if (folder.parent_id) {
      const newFolder = getFolderById(folder.parent_id, tree);
      buildArray(newFolder, tree);
    } else {
      return;
    }
  }

  buildArray(currentFolder, foldersTree);

  // reversing to start with parents
  pathArray.reverse();
  return pathArray;
}

function SideBar({ foldersTree, setRevealFolderDialog, setPathArray }) {
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
          onItemClick={(e, id) => {
            const folder = getFolderById(id, foldersTree);
            const pathArray = generatePathArray(folder, foldersTree);
            const user = foldersTree[0];

            if (pathArray[0] !== user) {
              pathArray.unshift(user);
            }
            setPathArray(pathArray);
          }}
        />
      </div>
    </div>
  );
}

export default SideBar;
