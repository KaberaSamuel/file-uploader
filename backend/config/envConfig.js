import dotenv from "dotenv";
dotenv.config();

const nodeEnv = process.env.NODE_ENV;
const jwtSecret = process.env.JWT_SECRET;
const sessionSecret = process.env.SESSION_SECRET;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

export { nodeEnv, jwtSecret, sessionSecret, supabaseUrl, supabaseKey };
