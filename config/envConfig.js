import dotenv from "dotenv";
dotenv.config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const port = process.env.PORT;

export { host, user, database, password, port };
