// import { FoodFromClient } from "./interface/PostFoodClient";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  verifyRefreshToken,
} from "./token";
import { NextFunction, Request, Response } from "express";
import { User, UserTokenData } from "../../interfaces/user";
import ApiErrors from "./errors";
import multer from "multer";
import { checkPropertiesNull, fileIsImage } from "./functions";
import {
  insertUser,
  checkEmailExists,
  storeRefreshToken,
  getUserByEmail,
  getDishByIndex,
  deleteRefreshToken,
  insertLike,
  toggleLike,
  getUserLikes,
  insertDish,
  getDishById,
  addComment,
} from "./postgre";
import { ClientDish, Comment } from "../../interfaces/Ingridient";
import { PrismaClient, Users } from "@prisma/client";
import path from "path";
import jwtDecode from "jwt-decode";

const upload = multer({ dest: "uploads/" });
const prisma = new PrismaClient();
class RouteLogic {
  SendImage(req: Request, res: Response) {
    let query = req.params.name;
    const fileDest = path.join(__dirname, "..", "uploads", query);
    res.sendFile(fileDest);
  }
  async Like(req: Request, res: Response, next: Function) {
    try {
      console.log(req.body);

      let { dish_id, user_id } = req.body;
      await toggleLike(dish_id, user_id);
    } catch (err) {
      console.error(err);
    } finally {
      res.end();
    }
  }
  async Login(req: Request, res: Response, next: Function) {
    try {
      let userData: Users = req.body;
      const refreshToken = createRefreshToken(userData);
      const accessToken = createAccessToken(userData);
      await storeRefreshToken(userData, refreshToken);
      const user = await getUserByEmail(userData.email!);
      sendRefreshToken(res, refreshToken);
      let userLikes = await getUserLikes(user!.id);
      res.send({ token: accessToken, success: true, likes: userLikes });
      // console.log(userLikes);
      //Setting the Authorization header in the response is not a common use case,
      //as the Authorization header is typically used in the request sent by the client to the server to authenticate the
      // client with the server. However, there may be situations where you want to send an access token to the client in
      //the response headers for use in subsequent requests.
      // res.setHeader("Authorization", `Bearer ${accessToken}`);

      return res.end();
    } catch (e) {
      return next(e);
    }
  }

  async Register(req: Request, res: Response, next: Function) {
    try {
      let userData: User = req.body;
      if (await checkEmailExists(userData.email))
        return next(res.status(400).json("Wrong data"));
      insertUser(userData);
      res.end();
    } catch (e) {
      next(e);
    }
  }
  Logout(req: Request, res: Response, next: Function) {
    try {
      req.cookies.jrt;

      res.clearCookie("jrt");
      res.end();
    } catch (error) {
      next(error);
    }
  }
  async GetUserDish(req: Request, res: Response, next: NextFunction) {
    const { jrt } = req.cookies;
    try {
      if (!jrt) {
        next(ApiErrors.BadRequest("No token in cookie"));
      }
      const userData: any = jwtDecode(jrt);
      const user = await getUserByEmail(userData.email!);
      // sendRefreshToken(res, refreshToken);
      let userLikes = await getUserLikes(user!.id);
      res.send({ success: true, likes: userLikes });
    } catch (error) {
      console.log(error);
    }
  }
  async Refresh(req: Request, res: Response, next: Function) {
    try {
      const { jrt } = req.cookies;
      // console.log(req.cookies.jrt + "COOKIE TOKEN");

      if (!jrt) next(ApiErrors.BadRequest("No token In cookie"));

      let payload: any = await verifyRefreshToken(jrt);

      if (payload === null) next(ApiErrors.BadRequest("Invalid Token"));
      // const user = await getUserByName(payload!.name);
      const user = await getUserByEmail(payload?.email);
      if (!user) return next(Error("No user with this name"));

      // if (user.tokens?.refresh !== token)
      //   return next(ApiErrors.BadRequest("User have wrong refresh Token!", []));
      //UPDATE REFRESH TOKEN IN DB THEN SEND NEW TO USER;
      const newRT = createRefreshToken(user);
      await deleteRefreshToken(jrt);
      await storeRefreshToken(user, newRT);
      // writeRefreshTokenToDB(await getUserIdByName(user.name), newRT);
      res.status(200).send({ ok: true, token: createAccessToken(user) });
    } catch (error) {
      next(error);
    }
  }

  async AddDish(req: Request, res: Response, next: Function) {
    try {
      const { dish } = req.body;
      const clientDish: ClientDish = JSON.parse(dish);
      clientDish.ingredients.pop()!;
      console.log(clientDish.recipes);
      const fileName = req.file?.filename;
      const url = "http://localhost:8000/uploads/" + fileName;
      if (checkPropertiesNull(clientDish))
        throw next(ApiErrors.BadRequest("Not all fields have been filed"));
      await insertDish(clientDish, url);
      res.send({ ok: true, message: "Created successfully" });
    } catch (error) {
      console.log(error);
    }
    next();
  }
  async getDish(req: Request, res: Response, next: NextFunction) {
    let data = await getDishById(req.body.id);
    res.json(data);
    next();
  }
  async data(req: Request, res: Response, next: NextFunction) {
    try {
      let id: number = Number(req.query.id);
      let dish = await getDishByIndex(id);
      res.json(dish);
    } catch (error) {
      res.status(400);
    } finally {
      res.end();
    }
  }
  async Comment(req: Request, res: Response, next: NextFunction) {
    try {
      const { jrt } = req.cookies;
      const userData: UserTokenData = jwtDecode(jrt);
      console.log(userData);

      let comment: Comment = req.body;
      //Check comment with middleware
      console.log(comment);

      await addComment(comment, userData.id);
      res
        .status(200)
        .json({ ok: true, message: "your commnet added", comment: comment });
    } catch (error) {
      console.log(error);
    } finally {
      next();
    }
  }
  async getLikesOfDish(req: Request, res: Response, next: NextFunction) {}
}

export default new RouteLogic();
