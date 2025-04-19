import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";

import { insertIntoUsers } from "./db.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/addUser", async (req, res) => {
  try {
    const { fullname, email, password1 } = req.body;
    const hashedPassword = await bcrypt.hash(password1, 10);
    await insertIntoUsers(fullname, email, hashedPassword);
    res.json();
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => {
  console.log("server open");
});
