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

async function deleteFolder(removables) {
  for (const folder of removables) {
    await supabase.from("folders").delete().eq("id", folder.id);
  }

  return;
}

async function uploadFile(file, fileBase64) {
  // upload the file to supabase
  const { data, error } = await supabase.storage
    .from("files")
    .upload(Date.now() + "-" + file.originalname, fileBase64);

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
  getFolders,
  getFiles,
  getAllUsers,
  deleteFolder,
  uploadFile,
};
