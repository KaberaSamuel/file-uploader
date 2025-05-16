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

export {
  insertIntoUsers,
  insertIntoFolders,
  getUserByUsername,
  getUserById,
  getFolders,
  getAllUsers,
};
