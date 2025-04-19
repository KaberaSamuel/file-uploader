import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/allUsers", async (req, res) => {
//   const users = await getAllUsers();
//   res.json({ allUsers: users });
// });

app.post("/addUser", async (req, res) => {
  console.log(req.body);
  res.redirect();
});

app.listen(3000, () => {
  console.log("server open");
});
