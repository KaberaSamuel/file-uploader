import pg from "pg";

import { host, user, database, password, port } from "./config/envConfig.js";

const { Pool } = pg;

const pool = new Pool({
  host: host,
  user: user,
  database: database,
  password: password,
  port: port,
});

async function createTableUsers() {
  await pool.query(`
      CREATE TABLE users (
          id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          fullname VARCHAR(255),
          email VARCHAR(255),
          password VARCHAR(255)

      );
  `);
}

async function insertIntoSideUsers(name) {
  await pool.query("INSERT INTO sideusers (fullname)VALUES ($1)", [name]);
}

async function getAllUsers() {
  const { rows } = await pool.query(`SELECT * FROM sideusers;`);
  return rows;
}

createTableUsers();

export { getAllUsers };
