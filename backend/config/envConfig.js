import dotenv from "dotenv";
dotenv.config();

const nodeEnv = process.env.NODE_ENV;
const jwtSecret = process.env.JWT_SECRET;
const sessionSecret = process.env.SESSION_SECRET;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const nodeSalt = process.env.NODE_SALT;

let frontendURL = "https://file-uploader-frontend-m9a9.onrender.com";

if (nodeEnv === "development") {
  frontendURL = "http://localhost:5173";
}

export {
  nodeEnv,
  nodeSalt,
  jwtSecret,
  sessionSecret,
  supabaseUrl,
  supabaseKey,
  frontendURL,
};
