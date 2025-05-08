import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderClosed,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";
import { useLoaderData, useNavigation } from "react-router-dom";

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
            <div>
              <FontAwesomeIcon className="icon" icon={faFolderClosed} />
              <p>{name}</p>
            </div>
            <p>--</p>
            <p>{date}</p>
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
          if (index < lastIndex) {
            return (
              <div key={id}>
                <p>{name}</p>
                <FontAwesomeIcon className="icon" icon={faChevronRight} />
              </div>
            );
          } else {
            return <p key={id}>{name}</p>;
          }
        })}
      </div>

      <Items folders={folderContent} />
    </div>
  );
}

function FolderItem() {
  const { pathArray, folderContent } = useLoaderData();

  const navigate = useNavigation();
  if (navigate.state == "loading") {
    return <Loader />;
  }

  return <FolderView pathArray={pathArray} folderContent={folderContent} />;
}

export default FolderItem;
