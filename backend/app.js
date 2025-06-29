import express from "express";
import cors from "cors";
import api from "./apiRouter.js";
import cookieParser from "cookie-parser";
import { nodeEnv } from "./config/envConfig.js";

const app = express();

const frontendUrl =
  nodeEnv === "production"
    ? "https://file-uploader-1cpl.onrender.com"
    : "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
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
