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
import { checkIfLoginCorrect } from "./postgre";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../build/swagger.json";
const router = Router();
let storageConfig = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename(req, file, callback) {
    const fileExt = file.originalname.split(".").pop();
    callback(null, Date.now() + "." + fileExt);
  },
});
const MIMETYPE_MAP: any = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const upload = multer({
  dest: "uploads/",
  storage: storageConfig,
  limits: { fileSize: 50_000_000 },
  fileFilter(req, file, callback) {
    const isValid = MIMETYPE_MAP[file.mimetype];
    if (!isValid) {
      callback(ApiErrors.BadRequest("Bad file extension!"));
      callback(null, false);
    }
    callback(null, true);
  },
});
router.use("/api-docs", swaggerUi.serve);
router.use(cookieParser());
router.get("/api-docs", swaggerUi.setup(swaggerDocument));
router.post("/post-food", upload.single("file"), RouteLogic.AddDish);
router.post(
  "/register",
  emailValidatorMiddleware,
  verifyEmailExist,
  RouteLogic.Register
);
router.post("/login", checkIfLoginCorrect, RouteLogic.Login);
router.post("/like", verifyTokenBearer, RouteLogic.Like);
router.get("/refresh", RouteLogic.Refresh);
router.post("/logout", RouteLogic.Logout);
router.get("/dish", RouteLogic.getDish);
router.get("/data", RouteLogic.data);
router.get("/uploads/:name", RouteLogic.SendImage);
router.get("/get-dish-likes", RouteLogic.getLikesOfDish);
router.get("/get-user-dish", RouteLogic.GetUserDish);
router.post("/post-comment", RouteLogic.Comment);
export default router;
