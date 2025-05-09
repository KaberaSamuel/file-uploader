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

async function insertIntoFolders(folderName, date, userID) {
  const { error, data } = await supabase
    .from("folders")
    .insert({ name: folderName, date: date, owner_id: userID });

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

async function getFolders(userID, folderID = null) {
  let folders;

  if (folderID) {
    const { data } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", userID)
      .eq("parent_id", folderID);

    folders = data;
  } else {
    const { data } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", userID);

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
