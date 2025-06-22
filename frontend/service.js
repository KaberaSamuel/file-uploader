// const apiUrl = "https://file-uploader-xctw.onrender.com";
const apiUrl = "http://localhost:3000";

function getDateString(milliSecs) {
  const date = new Date(milliSecs);
  let [, day, month, year, time] = date.toUTCString().split(" ");
  const dateString = `${month} ${day}, ${year}, ${time}`;
  return dateString;
}

function getSize(bytes) {
  // converting to kilo bytes
  let size = bytes / 1024;

  size =
    size < 1000 ? `${size.toFixed(2)} KB` : `${(size / 1024).toFixed(2)} MB`;
  return size;
}

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

// function to get actual files from bucket storage urls
async function getReadyFiles(fileRows) {
  const files = [];

  for (const { id, url, parent_id } of fileRows) {
    const [time, ...nameParts] = url.split("/").toReversed()[0].split("-");
    const milliSecs = Number(time);
    const fileName = decodeURIComponent(nameParts.join("-"));

    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });

    // props for the ready file
    file.created_at = getDateString(milliSecs);
    file.convertedSize = getSize(file.size);
    file.parent_id = parent_id;
    file.id = id;
    file.originalName = url.split("/").toReversed()[0];
    files.push(file);
  }

  return files;
}

function getFilesInFolder(id, dataTree) {
  const allFiles = dataTree[0].files;
  let files;

  if (id) {
    files = allFiles.filter((file) => file.parent_id == id);
  } else {
    files = allFiles.filter((file) => file.parent_id == null);
  }

  return files;
}

// function to create data tree from user object
function createDataTree(user) {
  const { name: username, folders, readyFiles, id } = user;
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
      files: readyFiles,
      children: foldersTree,
      userId: id,
    },
  ];

  return dataTree;
}

// function to extract data from server response and create data tree
async function extractData(response) {
  try {
    // when logged in
    if (!response.ok) return [null];

    const user = await response.json();
    user.readyFiles = await getReadyFiles(user.files);
    const dataTree = createDataTree(user);
    return dataTree;
  } catch (error) {
    // when not logged
    console.log(error);
    return [null];
  }
}

export {
  apiUrl,
  createDataTree,
  extractData,
  getFolderById,
  getPathArray,
  getAllFolderIds,
  getFilesInFolder,
};
