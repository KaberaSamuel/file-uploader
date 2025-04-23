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
          fullname VARCHAR(255),
          email VARCHAR(255),
          password VARCHAR(255)

      );
  `);
}

async function insertIntoUsers(fullname, email, password) {
  await pool.query(
    "INSERT INTO users (fullname, email, password)VALUES ($1, $2, $3)",
    [fullname, email, password]
  );
}

async function getUserById(id) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id='${id}';`);
  return rows[0];
}

async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email='${email}';`
  );

  return rows[0];
}

export { insertIntoUsers, getUserByEmail, getUserById };
