import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faSquareMinus,
} from "@fortawesome/free-regular-svg-icons";

function TreeNode({ node }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNode = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="tree-node">
      <div className="node">
        {node.children && (
          <FontAwesomeIcon
            icon={isOpen ? faSquareMinus : faSquarePlus}
            className="icon"
            onClick={toggleNode}
          />
        )}
        <span>{node.name}</span>
      </div>
      <div className="children">
        {isOpen && <TreeView data={node?.children} />}
      </div>
    </div>
  );
}

function TreeView({ data }) {
  return (
    <div className="tree-view">
      {data.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
}

export default TreeView;
