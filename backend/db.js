import { supabaseKey, supabaseUrl } from "./config/envConfig.js";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertIntoUsers(username, password) {
  const { data, error } = await supabase
    .from("users")
    .insert({ name: username, password: password });

  if (error) {
    console.log(error);
    return null;
  }
  return data;
}

async function insertIntoFolders(folder) {
  const { folderName, date, userId, parentId } = folder;
  const { error, data } = await supabase.from("folders").insert({
    name: folderName,
    date: date,
    owner_id: userId,
    parent_id: parentId,
  });

  if (error) {
    console.log(error);
    return null;
  }
  return data;
}

async function insertIntoFiles(file, parentId, userId) {
  const { error, data } = await supabase.from("files").insert({
    url: file.publicUrl,
    parent_id: parentId == "null" ? null : parentId,
    owner_id: userId,
  });

  if (error) {
    console.error(error);
    return null;
  }
  return data;
}

async function getUserById(id) {
  const { data } = await supabase.from("users").select("*").eq("id", id);
  const user = data[0];
  return user;
}

async function getUserByUsername(username) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("name", username);

  return data[0];
}

async function getAllUsers() {
  const { data } = await supabase.from("users").select("*");
  return data;
}

async function getFolders(userId, folderID = null) {
  let folders;

  if (folderID) {
    const { data } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", userId)
      .eq("parent_id", folderID);

    folders = data;
  } else {
    const { data } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", userId);

    folders = data;
  }

  return folders;
}

async function getFiles(userId) {
  const { data } = await supabase
    .from("files")
    .select("*")
    .eq("owner_id", userId);

  return data;
}

async function generateFileLink(filename, duration) {
  const { data } = await supabase.storage
    .from("files")
    .createSignedUrl(filename, duration);

  return data;
}

async function downloadFile(filename) {
  const { data, error } = await supabase.storage
    .from("files")
    .download(filename);

  return data;
}

async function deleteFolder(removables) {
  for (const folder of removables) {
    // deleting files in the folder
    const { data: files } = await supabase
      .from("files")
      .select("*")
      .eq("parent_id", folder.id);

    if (files?.length > 0) {
      for (const { id, url } of files) {
        const fileName = url.split("/").at(-1);
        await deleteFile(id, fileName);
      }
    }

    await supabase.from("folders").delete().eq("id", folder.id);
  }

  return;
}

async function deleteFile(id, name) {
  try {
    const decodedName = decodeURIComponent(name);

    // deleting from database table
    await supabase.from("files").delete().eq("id", id);

    // deleting from storage bucket
    await supabase.storage.from("files").remove([decodedName]);

    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

async function uploadFile(file, fileBase64) {
  const uniqueName = Date.now() + "-" + file.originalname;
  const { data, error } = await supabase.storage
    .from("files")
    .upload(uniqueName, fileBase64, {
      contentType: file.mimetype,
      createdAt: Date.now(),
    });

  if (error) {
    throw error;
  }

  // get public url of the uploaded file
  const { data: uploadedFile } = supabase.storage
    .from("files")
    .getPublicUrl(data.path);

  return uploadedFile;
}

export {
  insertIntoUsers,
  insertIntoFolders,
  insertIntoFiles,
  getUserByUsername,
  getUserById,
  getAllUsers,
  getFolders,
  getFiles,
  generateFileLink,
  downloadFile,
  deleteFolder,
  deleteFile,
  uploadFile,
};
