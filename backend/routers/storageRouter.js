import { Router } from "express";
import { insertIntoFolders } from "../db.js";

const storageRouter = Router();

storageRouter.post("/folder", async (req, res, next) => {
  try {
    const { folder } = req.body;
    const time = Date.now();
    await insertIntoFolders(folder, time);
    res.end();
  } catch (error) {
    next(error);
  }
});

export default storageRouter;
