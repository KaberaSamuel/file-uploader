import { Router } from "express";
import {
  registerGetReqs,
  registerPostReqs,
} from "../controllers/registerController.js";

const registerRouter = Router();
registerRouter.get("/", registerGetReqs);
registerRouter.post("/", registerPostReqs);

export { registerRouter };
