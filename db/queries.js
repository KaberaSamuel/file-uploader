import pool from "./pool.js";

async function createTableUsers() {
  await pool.query(`
          CREATE TABLE users (
              id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
              username VARCHAR(255),
              email VARCHAR (255),
              password VARCHAR (255)
          );
      `);
}

async function insertIntoUsers(username, email, password) {
  await pool.query(
    "INSERT INTO users (username, email,password) VALUES ($1, $2, $3)",
    [username, email, password]
  );
}

export { insertIntoUsers };
