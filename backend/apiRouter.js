import { Router } from "express";
import bcrypt from "bcrypt";
import { decode } from "base64-arraybuffer";
import jwt from "jsonwebtoken";

import {
  insertIntoUsers,
  insertIntoFolders,
  insertIntoFiles,
  getUserByUsername,
  getUserById,
  getFolders,
  getFiles,
  generateFileLink,
  downloadFile,
  deleteFolder,
  deleteFile,
  uploadFile,
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
  user.folders = await getFolders(user.id);
  user.files = await getFiles(user.id);
  res.json(user);
});

api.post("/folders", async (req, res, next) => {
  try {
    const { folder: folderName, parentId, userId, username } = req.body;
    const date = formatDate();
    await insertIntoFolders({
      userId,
      parentId,
      date,
      folderName,
    });

    // updated user to send to the client
    const user = {
      id: userId,
      folders: await getFolders(userId),
      files: await getFiles(userId),
      name: username,
    };

    res.json(user);
  } catch (error) {
    next(error);
  }
});

api.delete("/folders", async (req, res, next) => {
  try {
    const { folder, userId } = req.body;

    // folders to delete
    const removables = getFlatArray(folder);
    await deleteFolder(removables);

    const user = await getUserById(userId);
    user.folders = await getFolders(userId);
    user.files = await getFiles(userId);
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

api.post("/files", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { parentFolderId, userId, username } = req.body;

    if (!file) {
      res.status(400).end();
      return;
    }

    // decode file buffer to base64
    const fileBase64 = decode(file.buffer.toString("base64"));

    const uploadedFile = await uploadFile(file, fileBase64);
    await insertIntoFiles(uploadedFile, parentFolderId, userId);

    // updated user to send to the client
    const user = {
      id: userId,
      folders: await getFolders(userId),
      files: await getFiles(userId),
      name: username,
    };

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

api.delete("/files", async (req, res, next) => {
  try {
    const { fileId, filename, userId } = req.body;
    await deleteFile(fileId, filename);

    const user = await getUserById(userId);
    user.folders = await getFolders(userId);
    user.files = await getFiles(userId);
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
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
    user.files = await getFiles(user.id);
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

api.post("/share-link", async (req, res) => {
  const { type, item, duration } = req.body;
  let shareLink;
  if (type == "file") {
    const data = await generateFileLink(item, duration);
    shareLink = data.signedUrl;
  }
  res.json(shareLink);
});

api.post("/download", async (req, res) => {
  const { filename } = req.body;
  const data = await downloadFile(filename);
  const buffer = await data.arrayBuffer();
  res.end(Buffer.from(buffer));
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
