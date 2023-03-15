// import { FoodFromClient } from "./interface/PostFoodClient";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  verifyRefreshToken,
} from "./token";
import { NextFunction, Request, Response } from "express";
import { User } from "../../interfaces/user";
import ApiErrors from "./errors";
import multer from "multer";
import { checkPropertiesNull, fileIsImage } from "./functions";
import {
  insertUser,
  checkEmailExists,
  storeRefreshToken,
  getUserByEmail,
  getDish,
  deleteRefreshToken,
  insertLike,
  toggleLike,
  getUserLikes,
} from "./postgre";
import { Dish } from "../../interfaces/Ingridient";

const upload = multer({ dest: "uploads/" });

class RouteLogic {
  async Like(req: Request, res: Response, next: Function) {
    try {
      let { dish_id, user_id } = req.body;
      // console.log(req.body);
      await toggleLike(dish_id, user_id)
    } catch (err) {
      console.error(err);
    } finally {
      res.end();
    }
  }
  async Login(req: Request, res: Response, next: Function) {
    try {
      let userData: User = req.body;
      const refreshToken = createRefreshToken(userData);
      const accessToken = createAccessToken(userData);
      await storeRefreshToken(userData, refreshToken);
      const user = await getUserByEmail(userData.email!)
      sendRefreshToken(res, refreshToken);
      let userLikes = await getUserLikes(user!.id)
      res.send({ token: accessToken, success: true, likes: userLikes });
      // console.log(userLikes);
      //Setting the Authorization header in the response is not a common use case, 
      //as the Authorization header is typically used in the request sent by the client to the server to authenticate the
      // client with the server. However, there may be situations where you want to send an access token to the client in 
      //the response headers for use in subsequent requests.
      // res.setHeader("Authorization", `Bearer ${accessToken}`);

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
      req.cookies.jrt;

      res.clearCookie("jrt");
      res.end();
    } catch (error) {
      next(error);
    }
  }
  async Refresh(req: Request, res: Response, next: Function) {
    try {
      const { jrt } = req.cookies
      // console.log(req.cookies.jrt + "COOKIE TOKEN");

      if (!jrt) next(ApiErrors.BadRequest("No token In cookie"));

      let payload: any = await verifyRefreshToken(jrt);
      // console.log(payload + "PAYLOAD");

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
      res
        .status(200)
        .cookie("jrt", newRT, {
          httpOnly: true,
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
  Verify(req: Request, res: Response, next: Function) { }
  async AddDish(req: Request, res: Response, next: Function) {
    let dish: Dish = {
      name: "",
      id: 0,
      cuisine: "",
      slug: "",
      url: "",
      ingredients: [],
    };
    if (checkPropertiesNull(dish))
      return next(ApiErrors.BadRequest("Not all fields have been filed"));
    res.send({ ok: true });
    next();
  }
  async getDish(req: Request, res: Response, next: NextFunction) {
    let data = await getDish(req.body.id);
    res.json(data);
    next();
  }
}

export = new RouteLogic();
