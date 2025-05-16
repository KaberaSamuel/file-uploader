// const apiUrl = "https://file-uploader-xctw.onrender.com";
const apiUrl = "http://localhost:3000";

function getAllFolderIds(items) {
  const ids = [];

  function buildArray(nodes) {
    for (const node of nodes) {
      ids.push(node.id);
      if (node.children) {
        buildArray(node.children);
      }
    }
  }

  buildArray(items);
  return ids;
}

function getPathArray(folder, dataTree) {
  const pathArray = [];

  function buildArray(folder) {
    pathArray.unshift(folder);
    if (!folder.parent_id) {
      return;
    }

    const parent = getFolderById(folder.parent_id, dataTree);
    buildArray(parent);
  }

  buildArray(folder);
  pathArray.unshift(dataTree[0]);

  return pathArray;
}

function getFolderById(id, dataTree) {
  for (let folder of dataTree) {
    if (folder.id === id) {
      return folder;
    }

    if (folder.children) {
      const foundFolder = getFolderById(id, folder.children);

      if (foundFolder) {
        return foundFolder;
      }
    }
  }
}

// function to create data tree from user object
function createDataTree(user) {
  const { name: username, folders, id } = user;

  // reversing the folder to start with the lates folders
  folders.reverse();

  folders.forEach((child, index) => {
    const parent = folders.find((folder) => folder.id === child.parent_id);

    if (parent) {
      // if parent already has children
      if (parent.children) {
        parent.children.push(child);
      } else {
        parent.children = [child];
      }

      const parentIndex = folders.findIndex(({ id }) => id === parent.id);
      // updating parent element
      folders[parentIndex] = parent;

      // marking child element as taken
      folders[index] = "taken";
    }
  });

  // removing every taken child
  const foldersTree = folders.filter((folder) => folder !== "taken");

  // adding user at the root
  const dataTree = [
    {
      name: username,
      id: 0,
      parent_id: null,
      children: foldersTree,
      userId: id,
    },
  ];

  return dataTree;
}

// function to load user data and create data tree
async function getDataTree() {
  try {
    const response = await fetch(`${apiUrl}/folders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return [null];
    }

    const { user } = await response.json();
    const dataTree = createDataTree(user);

    return dataTree;
  } catch (error) {
    console.log(error);
    return [null];
  }
}

export {
  apiUrl,
  createDataTree,
  getDataTree,
  getFolderById,
  getPathArray,
  getAllFolderIds,
};
