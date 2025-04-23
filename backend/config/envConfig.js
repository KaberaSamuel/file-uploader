import dotenv from "dotenv";
dotenv.config();

const host = process.env.HOST;
const dbUser = process.env.USER;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;
const sessionSecret = process.env.SESSION_SECRET;

export { host, dbUser, database, password, port, nodeEnv, sessionSecret };
