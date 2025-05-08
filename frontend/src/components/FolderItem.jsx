import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderClosed,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";
import { useParams, useNavigation, Link } from "react-router-dom";
import { getFolderById, getPathArray } from "../../service.js";
import { useAuth } from "./AuthProvider";

function Items({ folders }) {
  if (folders && folders.length > 0) {
    return (
      <ul>
        <li className="header">
          <p>name</p>
          <p>size</p>
          <p>created</p>
        </li>
        {folders.map(({ id, name, date }) => (
          <li key={id}>
            <Link to={`/folders/${id}`}>
              <div>
                <FontAwesomeIcon className="icon" icon={faFolderClosed} />
                <p>{name}</p>
              </div>
              <p>--</p>
              <p>{date}</p>
            </Link>
          </li>
        ))}
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

export function FolderView({ pathArray, folderContent }) {
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

      <Items folders={folderContent} />
    </div>
  );
}

function FolderItem() {
  let { id } = useParams();
  id = Number(id);

  const { dataTree } = useAuth();
  const folder = getFolderById(id, dataTree);
  const pathArray = getPathArray(folder, dataTree);

  const navigate = useNavigation();

  if (navigate.state == "loading") {
    return <Loader />;
  }

  return <FolderView pathArray={pathArray} folderContent={folder.children} />;
}

// default folder item for user data
function DefaultFolderItem() {
  const { dataTree } = useAuth();

  const user = dataTree[0];
  const pathArray = [{ name: user.name, id: 0 }];

  const folderContent = user.children;

  const navigate = useNavigation();

  if (navigate.state == "loading") {
    return <Loader />;
  }

  return <FolderView pathArray={pathArray} folderContent={folderContent} />;
}

export { DefaultFolderItem, FolderItem };
