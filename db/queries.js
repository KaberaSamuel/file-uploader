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

async function createTableFolders() {
  await pool.query(`
    CREATE TABLE folders (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255),
        parent_id INT,
        user_id INT
    );
  `);
}

async function insertIntoFolders(name, parent_id, user_id) {
  await pool.query(
    "INSERT INTO folders (name, parent_id, user_id) VALUES ($1, $2, $3)",
    [name, parent_id, user_id]
  );
}

async function insertIntoUsers(username, email, password) {
  await pool.query(
    "INSERT INTO users (username, email,password) VALUES ($1, $2, $3)",
    [username, email, password]
  );
}

async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email='${email}';`
  );

  return rows[0];
}

async function getUserByPassword(password) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE password='${password}';`
  );

  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id='${id}';`);

  return rows[0];
}

async function getTopFoldersByUser(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM folders WHERE (user_id='${userId}') AND (parent_id=0);`
  );

  return rows;
}

async function getFoldersByUser(userId) {
  const { rows } = await pool.query(`SELECT * FROM folders;`);

  return rows;
}

async function getFolderchildren(userId, folderId) {
  const { rows } = await pool.query(
    `SELECT * FROM folders WHERE (user_id=${userId}) AND (parent_id=${folderId});`
  );

  return rows;
}

insertIntoFolders("missy", 27, 35);

export {
  insertIntoUsers,
  insertIntoFolders,
  getUserByEmail,
  getUserByPassword,
  getUserById,
  getTopFoldersByUser,
  getFoldersByUser,
  getFolderchildren,
};
