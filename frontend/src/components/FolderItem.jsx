import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderClosed,
  faChevronRight,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useOutletContext, Link } from "react-router-dom";
import {
  getFilesInFolder,
  getFolderById,
  getPathArray,
} from "../../service.js";
import { useAuth } from "./AuthProvider";

function Items({ folders, files, setActiveFile }) {
  // if folder isn't empty
  if (folders.length > 0 || files.length > 0) {
    return (
      <ul>
        <li className="header">
          <p>name</p>
          <p>size</p>
          <p>created</p>
        </li>

        {/* rendering child folders */}
        {folders.map(({ id, name, date }) => (
          <li key={id}>
            <Link to={`/folders/${id}`} className="item">
              <div className="label">
                <FontAwesomeIcon icon={faFolderClosed} />
                <p>{name}</p>
              </div>
              <p>--</p>
              <p>{date}</p>
            </Link>
          </li>
        ))}

        {/* rendering child files */}
        {files.map((file) => {
          const { id, name, created_at, convertedSize } = file;
          let date = created_at.split(",").slice(0, -1);
          date = date.join(",");

          return (
            <li
              key={id}
              onClick={() => {
                setActiveFile(file);
              }}
            >
              <div className="item">
                <div className="label">
                  <FontAwesomeIcon icon={faFile} />
                  <p>{name}</p>
                </div>
                <p>{convertedSize}</p>
                <p>{date}</p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  } else {
    return (
      <div className="no-items">
        <p>No items yet</p>
      </div>
    );
  }
}

function FolderView({ pathArray, folders, files, setActiveFile }) {
  const lastIndex = pathArray.length - 1;
  return (
    <div className="folder-content">
      <div className="path-bar">
        {pathArray.map(({ name, id }, index) => {
          const hrefLink = id == 0 ? `/folders` : `/folders/${id}`;
          if (index < lastIndex) {
            return (
              <div key={id}>
                <Link to={hrefLink}>{name}</Link>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            );
          } else {
            return (
              <Link key={id} to={hrefLink}>
                {name}
              </Link>
            );
          }
        })}
      </div>

      <Items folders={folders} files={files} setActiveFile={setActiveFile} />
    </div>
  );
}

// component for displaying other folders which are not user root folder
function FolderItem() {
  let { id } = useParams();
  id = Number(id);

  const { dataTree } = useAuth();
  const folder = getFolderById(id, dataTree);
  const pathArray = getPathArray(folder, dataTree);
  const childFiles = getFilesInFolder(id, dataTree);

  const { setActiveFile } = useOutletContext();

  return (
    <FolderView
      pathArray={pathArray}
      folders={folder.children ? folder.children : []}
      files={childFiles}
      setActiveFile={setActiveFile}
    />
  );
}

// component for displaying user root folder content
function DefaultFolderItem() {
  const { dataTree } = useAuth();
  const user = dataTree[0];
  const pathArray = [{ name: user.name, id: 0 }];
  const childFiles = getFilesInFolder(null, dataTree);

  const { setActiveFile } = useOutletContext();

  return (
    <FolderView
      pathArray={pathArray}
      folders={user.children}
      files={childFiles}
      setActiveFile={setActiveFile}
    />
  );
}

export { DefaultFolderItem, FolderItem };
