import { Router } from "express";
import { loginGetReqs, loginPostReqs } from "../controllers/loginController.js";

const loginRouter = Router();
loginRouter.get("/", loginGetReqs);
loginRouter.post("/", loginPostReqs);

export { loginRouter };
