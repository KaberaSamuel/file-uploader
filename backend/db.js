import pg from "pg";

import { host, dbUser, database, password, port } from "./config/envConfig.js";

const { Pool } = pg;

const pool = new Pool({
  host: host,
  user: dbUser,
  database: database,
  password: password,
  port: port,
});

async function createTableUsers() {
  await pool.query(`
      CREATE TABLE users (
          id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          username VARCHAR(255),
          password VARCHAR(255)

      );
  `);
}

async function createTableFolders() {
  await pool.query(`
      CREATE TABLE folders (
          id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          name VARCHAR(255),
          date VARCHAR(255)
      );
  `);
}

async function createTableFiles() {
  await pool.query(`
      CREATE TABLE files (
          id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          name VARCHAR(255),
          type VARCHAR(255),
          size VARCHAR(255),
          date INT
      );
  `);
}

async function insertIntoUsers(username, password) {
  await pool.query("INSERT INTO users ( username, password)VALUES ($1, $2)", [
    username,
    password,
  ]);
}

async function insertIntoFolders(folderName, time) {
  await pool.query("INSERT INTO folders ( name, date)VALUES ($1, $2)", [
    folderName,
    time,
  ]);
}

async function getUserById(id) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id='${id}';`);
  return rows[0];
}

async function getUserByUsername(username) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE username='${username}';`
  );

  return rows[0];
}

async function getFolders() {
  const { rows } = await pool.query(`SELECT * FROM folders;`);

  return rows;
}

export {
  insertIntoUsers,
  insertIntoFolders,
  getUserByUsername,
  getUserById,
  getFolders,
};
