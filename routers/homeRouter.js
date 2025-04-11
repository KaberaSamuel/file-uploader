import { Router } from "express";
import { homeGetReqs, homePostReqs } from "../controllers/homeController.js";
import { checkAuthenticated } from "../config/passportConfig.js";

const homeRouter = Router();
homeRouter.get("/", checkAuthenticated, homeGetReqs);
homeRouter.post("/", homePostReqs);

export default homeRouter;
