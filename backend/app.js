import express from "express";
import cors from "cors";
import api from "./apiRouter.js";
import cookieParser from "cookie-parser";
import { frontendURL } from "./config/envConfig.js";

const app = express();

app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", api);

// error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "internal server error" });
});

app.listen(3000, () => {
  console.log("server open");
});
