import {
  insertIntoFolders,
  getTopFoldersByUser,
  getFoldersByUser,
  getFolderchildren,
} from "../db/queries.js";

// function for creating folders tree
async function createFolderTree(userId = 35) {
  const folders = await getFoldersByUser(userId);

  let sortedFolders = folders.toSorted((a, b) => b.parent_id - a.parent_id);

  let index = 0;
  sortedFolders.forEach((folder) => {
    folder.children = [];
    sortedFolders[index] = folder;
    index++;
  });

  sortedFolders.forEach((folder, index) => {
    const parentId = sortedFolders.findIndex(
      (element) => element.id === folder.parent_id
    );

    if (parentId !== -1) {
      const parentFolderChildren = sortedFolders[parentId].children;
      parentFolderChildren.push(folder);
      sortedFolders[parentId].children = parentFolderChildren;
    }

    // marking deep children 'taken'
    if (folder.parent_id !== 0) {
      sortedFolders[index] = "taken";
    }
  });

  const treeArray = sortedFolders.filter((element) => element !== "taken");
}

createFolderTree();

function homeGetReqs(req, res) {
  res.render("home");
}

async function homePostReqs(req, res) {
  if (req.body.folderName !== "") {
    // code to insert folder into database
  }
  res.redirect("/");
}

export { homeGetReqs, homePostReqs };
