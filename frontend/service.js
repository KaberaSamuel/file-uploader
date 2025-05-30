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

// function to get files in a certain a folder
function getFiles(id, dataTree) {
  const allFiles = dataTree[0].files;

  let files;

  if (id) {
    files = allFiles.filter((file) => file.parent_id == id);
  } else {
    files = allFiles.filter((file) => file.parent_id == null);
  }

  console.log(files);

  return files;
}

// function to create data tree from user object
function createDataTree(user) {
  const { name: username, folders, files, id } = user;

  const foldersTree = [];

  // array to keep track of all unique added items
  const flatArray = [];

  for (const item of folders) {
    addFoldersTree(item);
  }

  function addFoldersTree(child) {
    // ensuring unique items
    if (flatArray.includes(child)) {
      return;
    }

    flatArray.push(child);
    const parent = folders.find((folder) => folder.id == child.parent_id);

    if (parent) {
      // if parent already has children
      if (parent.children) {
        parent.children.push(child);
      } else {
        parent.children = [child];
      }

      //if parent also has a parent
      if (parent.parent_id) {
        addFoldersTree(parent);
      }
    } else {
      // top level folder
      foldersTree.push(child);
    }
  }

  // adding user at the root
  const dataTree = [
    {
      name: username,
      id: 0,
      parent_id: null,
      files: files,
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
  getFiles,
};
