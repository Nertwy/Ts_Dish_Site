import { FoodFromClient } from "./interface/PostFoodClient";
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from "./token";
import { Request, Response } from "express";
import { User } from "../../interfaces/user";
import {
  docUsersCol,
  getUserByName,
  getUserIdByName,
  writeAccessTokenToDB,
  writeRefreshTokenToDB
} from "./database";
import { db } from "./database";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import ApiErrors from "./errors";
import multer from "multer";
import { checkPropertiesNull, fileIsImage } from "./functions";
import { insertUser, checkEmailExists } from "./postgre";

const upload = multer({ dest: "uploads/" });

class RouteLogic {
  async Login(req: Request, res: Response, next: Function) {
    try {
      let userData: User = await getUserByName(req.body.name);
      const refreshToken = createRefreshToken(userData);
      sendRefreshToken(res, refreshToken);
      const accessToken = createAccessToken(userData);
      writeRefreshTokenToDB(await getUserIdByName(req.body.name), refreshToken);
      // writeAccessTokenToDB(await getUserIdByName(req.body.name), accessToken);
      res.send({ token: accessToken, success: true });
      return res.end();
    } catch (e) {
      next(e);
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
      res.clearCookie("jrt");
      res.end();
    } catch (error) {
      next(error);
    }
  }
  async Refresh(req: Request, res: Response, next: Function) {
    try {
      const token = req.cookies.jrt;
      if (!token) next(ApiErrors.BadRequest("No token In cookie"));

      let payload: any = verifyRefreshToken(token);

      if (payload === null) next(ApiErrors.BadRequest("Invalid Token"));
      const user = await getUserByName(payload!.name);
      if (!user) next(Error("No user with this name"));

      if (user.tokens?.refresh !== token)
        return next(ApiErrors.BadRequest("User have wrong refresh Token!", []));
      //UPDATE REFRESH TOKEN IN DB THEN SEND NEW TO USER;
      const newRT = createRefreshToken(user);
      writeRefreshTokenToDB(await getUserIdByName(user.name), newRT);
      return res
        .status(200)
        .cookie("jrt", newRT, {
          httpOnly: true
        })
        .send({ ok: true, token: createAccessToken(user) });
    } catch (error) {
      next(error);
    }
  }

  async PostFood(req: Request, res: Response, next: Function) {
    res.json(res.locals.body);
    res.end();
  }
  setLikes(req: Request, res: Response, next: Function) {
    let imageId = req.body.id;
    let like = req.body.like;
  }
  Verify(req: Request, res: Response, next: Function) { }
  async AddDish(req: Request, res: Response, next: Function) {
    let dish: FoodFromClient = {
      name: req.body?.name,
      steps: req.body?.steps,
      cuisine: req.body?.cuisine,
      ingredients: req.body?.ing
    };
    if (checkPropertiesNull(dish))
      return next(ApiErrors.BadRequest("Not all fields have been filed"));
    res.send({ ok: true });
    next();
  }
}

export = new RouteLogic();