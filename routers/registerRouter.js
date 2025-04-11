import { Router } from "express";
import {
  registerGetReqs,
  registerPostReqs,
} from "../controllers/registerController.js";

import { checkNotAuthenticated } from "../config/passportConfig.js";

const registerRouter = Router();
registerRouter.get("/", checkNotAuthenticated, registerGetReqs);
registerRouter.post("/", registerPostReqs);

export default registerRouter;
