// const apiUrl = "https://file-uploader-xctw.onrender.com";
const apiUrl = "http://localhost:3000";

function createFoldersTree(folders) {
  folders.reverse();

  folders.forEach((child, index) => {
    const parent = folders.find((folder) => folder.id === child.parent_id);

    if (parent) {
      // if parent already has children
      if (parent.children) {
        const children = parent.children;
        children.push(child);
        parent.children = children;
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
  const updatedFolders = folders.filter((folder) => folder !== "taken");

  return updatedFolders;
}

async function generatePathArray(folderId) {
  const response = await fetch(`${apiUrl}/folders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const { folders } = await response.json();

  let pathArray = [];
  function buildPath(id) {
    const folder = folders.find((item) => item.id == id);
    pathArray.push(folder);

    // when folder no parent
    if (!folder.parent_id) {
      return;
    }

    buildPath(folder.parent_id);
  }

  buildPath(folderId);
  return pathArray;
}

async function fetchUserData() {
  try {
    const response = await fetch(`${apiUrl}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const { message } = await response.json();
      console.log(message);
      return null;
    }

    const { user } = await response.json();

    return user;
  } catch {
    return null;
  }
}

async function getUserFoldersTree() {
  try {
    const response = await fetch(`${apiUrl}/folders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const { folders, user } = await response.json();
    const updatedFolders = createFoldersTree(folders);
    const foldersTree = [
      {
        name: user.name,
        children: updatedFolders,
        id: 0,
      },
    ];

    return foldersTree;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getFolderContent(folderId) {
  const id = Number(folderId);
  const fetchUrl = id === 0 ? `${apiUrl}/folders` : `${apiUrl}/folders/${id}`;

  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const { folders } = await response.json();
    return folders;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// the function load content on individual folderRoute visited
async function folderContentLoader({ params }) {
  const { id } = params;
  const pathArray = await generatePathArray(id);
  const folderContent = await getFolderContent(id);
  const { name } = await fetchUserData();

  pathArray.push({ name, id: 0 });
  // reversing the array to start from user to current directory
  pathArray.reverse();

  return { pathArray, folderContent };
}

export {
  apiUrl,
  fetchUserData,
  getUserFoldersTree,
  getFolderContent,
  generatePathArray,
  folderContentLoader,
};
