import { User } from "../../interfaces/user";
import { decode, sign, verify } from "jsonwebtoken";
import "dotenv/config";
import { Request, Response } from "express";
import ApiErrors from "./errors";
import { getUserByEmail } from "./postgre";

export const createAccessToken = (user: User): string => {
  const token = sign(
    { name: user.name, role: user.role, email: user.email, id: user.id },
    process.env.ACCESSSECRET as string,
    {
      expiresIn: "15s"
    }
  );
  return token;
};
export const createRefreshToken = (user: User): string => {
  const token = sign(
    {
      name: user.name,
      role: user.role,
      email: user.email,
      id: user.id,
      tokenVersion: user.tokens?.tokenVersion
    },
    process.env.REFRESHSECRET as string,
    {
      expiresIn: "7d"
    }
  );
  return token;
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.status(200).cookie("jrt", token, { httpOnly: true });
};
export const sendAccessToken = (res: Response, token: string) => {
  res.status(200).send({ token: token });
};

export const verifyAccessToken = (AccessToken: string) => {
  try {
    let userData = verify(AccessToken, process.env.ACCESSSECRET as string);
    return userData;
  } catch (error) {
    console.error(error);

    return null;
  }
};


export const verifyRefreshToken = async (RefreshToken: string) => {
  try {
    const userData = verify(RefreshToken, process.env.REFRESHSECRET as string);
    return userData;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const verifyTokenBearer = (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const loginHeaderToken = req.headers.authorization?.split(" ")[1];
    if (!loginHeaderToken) return next(ApiErrors.UnauthorizedError());
    if (!verifyAccessToken(loginHeaderToken))
      return next(ApiErrors.TokenExpired())
    res.locals.body = req.body;
    return next();
  } catch (error) {
    next(error);
  }
};
