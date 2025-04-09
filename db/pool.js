import pg from "pg";

import { host, user, database, password, port } from "../config/envConfig.js";

const { Pool } = pg;

const pool = new Pool({
  host: host,
  user: user,
  database: database,
  password: password,
  port: port,
});

export default pool;
