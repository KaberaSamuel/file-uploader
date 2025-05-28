import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  insertIntoUsers,
  insertIntoFolders,
  getUserByUsername,
  getUserById,
  getFolders,
  deleteFolder,
} from "./db.js";

import { jwtSecret } from "./config/envConfig.js";
import upload from "./config/multerConfig.js";
import "./config/passportConfig.js";

const api = Router();

function formatDate() {
  const time = Date.now();
  let date = new Date(time);
  date = date.toDateString();
  const dateArray = date.split(" ").splice(1);
  dateArray[1] += ",";
  date = dateArray.join(" ");

  return date;
}

// function for getting a flat array of folder and its children
function getFlatArray(folder) {
  const array = [];

  function buildArray(currentFolder) {
    if (currentFolder.children) {
      currentFolder.children.forEach((child) => buildArray(child));
      delete currentFolder.children;
      array.push(currentFolder);
    } else {
      array.push(currentFolder);
    }
  }

  buildArray(folder);

  return array;
}

async function authenticateUser(req, res, next) {
  try {
    const token = req.cookies.token;
    if (token == null) return res.status(400).json({ message: "no token" });

    jwt.verify(token, jwtSecret, async (err, payload) => {
      if (err) return res.status(401).json({ message: "invalid token" });

      const user = await getUserById(payload.id);
      req.user = user;

      next();
    });
  } catch (error) {
    next(error);
  }
}

api.get("/folders", authenticateUser, async (req, res) => {
  const user = req.user;
  user.folders = await getFolders(req.user.id);
  res.json({ user });
});

api.post("/folders", authenticateUser, async (req, res, next) => {
  const { name: username, id: userId } = req.user;
  try {
    const { folder, parentId } = req.body;
    const date = formatDate();
    await insertIntoFolders({
      userId,
      parentId,
      date,
      folderName: folder,
    });

    const user = {
      id: userId,
      folders: await getFolders(userId),
      userId: userId,
      name: username,
    };

    res.json(user);
  } catch (error) {
    next(error);
  }
});

api.delete("/folders", authenticateUser, async (req, res, next) => {
  try {
    const { folder } = req.body;

    // folders to delete
    const removables = getFlatArray(folder);
    await deleteFolder(removables);

    const user = req.user;
    user.folders = await getFolders(user.id);
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

api.get("/folders/:id", authenticateUser, async (req, res) => {
  const { id: folderId } = req.params;
  const folders = await getFolders(req.user.id, folderId);

  res.json({ folders });
});

api.post("/files", upload.single("file"), (req, res) => {
  console.log("done");
  res.end();
});

api.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    if (!user) return res.status(400).json({ message: "incorrect username" });

    // check if password is correct
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "incorrect password" });

    // generate access token
    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    user.folders = await getFolders(user.id);

    return res.json({ user });
  } catch (error) {
    next(error);
  }
});

api.post("/register", async (req, res, next) => {
  try {
    const { username, password1 } = req.body;
    const hashedPassword = await bcrypt.hash(password1, 10);
    await insertIntoUsers(username, hashedPassword);
    res.end();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

api.get("/logout", (req, res, next) => {
  try {
    // Clearing JWT cookie
    res.cookie("token", null);
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

export default api;
