import { Request, Response, Router } from "express";
import path from "path";
import fs from "fs";
import json_data from "./Database_of_things/recipes.json";
const router = Router();
const photos_folder = path.resolve(__dirname + "/Database_of_things/images/");
router.post("/login");
router.post("/registration");

router.get("/data", (req: Request, res: Response) => {
  try {
    // json_data[0].node.
    let id = Number(req.query.id);
    res.send(json_data[id].node);
  } catch (error) {
    res.status(400);
  }
  res.end();
});
export default router;
