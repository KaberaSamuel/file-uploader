import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderClosed,
  faChevronRight,
  faFile
} from "@fortawesome/free-solid-svg-icons";
import { useParams, Link } from "react-router-dom";
import {
  getFilesInFolder,
  getFolderById,
  getPathArray,
} from "../../service.js";
import { useAuth } from "./AuthProvider";

function Items({ folders, files }) {
  // if folder isn't empty
  if (folders.length > 0 || files.length > 0) {
    return (
      <ul>
        <li className="header">
          <p>name</p>
          <p>size</p>
          <p>created</p>
        </li>

        {/* Looping through folders and rendering them */}
        {folders.map(({ id, name, date }) => (
          <li key={id}>
            <Link to={`/folders/${id}`} className="item">
              <div className="label">
                <FontAwesomeIcon className="icon" icon={faFolderClosed} />
                <p>{name}</p>
              </div>
              <p>--</p> 
              <p>{date}</p>
            </Link>
          </li>
        ))}

        {/* Looping through files and rendering them */}
        {files.map(({ id, name, created_at, convertedSize }) => {
          let date = created_at.split(",").slice(0, -1)
          date = date.join(",")
          
          return (
          <li key={id}>
              <div className="item">
                <div className="label">
                  <FontAwesomeIcon className="icon" icon={faFile} />
                  <p>{name}</p>
                </div>
                <p>{convertedSize}</p> 
                <p>{date}</p>
              </div>
          </li>
        )
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


function FolderView({ pathArray, folders, files }) {
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
                <FontAwesomeIcon className="icon" icon={faChevronRight} />
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

      <Items folders={folders} files={files}/>
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

  return (
    <FolderView
      pathArray={pathArray}
      folders={folder.children ? folder.children : []}
      files={childFiles}
    />
  );
}

// component for displaying user root folder content
function DefaultFolderItem() {
  const { dataTree } = useAuth();
  const user = dataTree[0];
  const pathArray = [{ name: user.name, id: 0 }];
  const childFiles = getFilesInFolder(null, dataTree);

  return <FolderView pathArray={pathArray} folders={user.children} files={childFiles}/>;
}

export { DefaultFolderItem, FolderItem };
