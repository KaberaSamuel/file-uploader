import bcrypt from "bcrypt";
import { insertIntoUsers } from "../db/queries.js";

function registerGetReqs(req, res) {
  res.render("register");
}

async function registerPostReqs(req, res) {
  const { username, email } = req.body;
  const password = await bcrypt.hash(req.body.password1, 10);
  insertIntoUsers(username, email, password);

  res.redirect("/register");
}

export { registerGetReqs, registerPostReqs };
