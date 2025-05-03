import express from "express";
import cors from "cors";
import authRouter from "./routers/authRouter.js";
import cookieParser from "cookie-parser";

const app = express();

const frontendURL = "https://file-uploader-frontend-m9a9.onrender.com";

app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRouter);

// error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "internal server error" });
});

app.listen(3000, () => {
  console.log("server open");
});
