import { Response, Request } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next:Function) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decode = jwt.verify(token, "qwe");
    req.body.token = decode;
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
