
import {
  emailValidatorMiddleware,
  verifyEmailExist,
} from "../middleware/middleware";
import { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { verifyTokenBearer } from "./token";
import multer from "multer";
import ApiErrors from "./errors";
import RouteLogic from "./RouteLogic";
import { checkIfLoginCorrect, getDish } from "./postgre";
import { PrismaClient } from "@prisma/client";
const router = Router();
let storageConfig = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  }
});
const MIMETYPE_MAP: any = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 50_000_000 },
  fileFilter(req, file, callback) {
    const isValid = MIMETYPE_MAP[file.mimetype];
    if (!isValid) {
      callback(ApiErrors.BadRequest("Bad file extension!"));
      callback(null, false);
    }
    callback(null, true);
  }
});
router.use(cookieParser());
router.post("/post-food",RouteLogic.AddDish)
router.post("/register", emailValidatorMiddleware, verifyEmailExist, RouteLogic.Register);
router.post("/login", checkIfLoginCorrect, RouteLogic.Login);
router.post(
  "/addDish",
  /*verifyAuth,*/ RouteLogic.AddDish,
  upload.single("image")
);
router.post("/like",verifyTokenBearer,RouteLogic.Like);
router.get("/refresh", RouteLogic.Refresh);

router.post("/logout", RouteLogic.Logout);
router.get("/getDB", verifyTokenBearer, RouteLogic.PostFood);
router.get("/dish", RouteLogic.getDish)
// router.get("/test",async(req,res)=>{
//   let id:number = Number(req.query.id)
//   res.json(await getDish(id)).end()
// })
router.get("/data", async (req: Request, res: Response) => {
  try {
    let id:number = Number(req.query.id);
    let dish = await getDish(id)
    res.json(dish);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
});
router.get("/checkAccessToken", RouteLogic.Verify);
export default router;
