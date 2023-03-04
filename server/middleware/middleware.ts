import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MulterError } from "multer";
import { isGeneratorFunction } from "util/types";

import { Role, User } from "../../interfaces/user";

import ApiErrors from "../src/errors";
import { convertUserData, fileIsImage, hashUserPass, validateEmail } from "../src/functions";
import { checkEmailExists, checkIfLoginCorrect } from "../src/postgre";

export const verifyToken = (req: Request, res: Response, next: Function) => {
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

export const emailValidatorMiddleware = (req:Request,res:Response,next:NextFunction)=>{
  const {email} = req.body;
  if(!email || !validateEmail(email)){
    return res.status(400).json({message:"Invalid email address"});
  }
  next()
}
// export const verifyAdmin = async (
//   req: Request,
//   res: Response,
//   next: Function
// ) => {
//   const user: User = req.body;

//   try {
//     let resul = await checkifAdmin(user);
//     if (resul) {
//       return next();
//     } else {
//       res.status(403);
//       res.end("No premision");
//       throw new Error("Premision to add dish denied");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

export const verifyRoles =(...allowedRoles:Role[])=>{
  return(req:Request,res:Response,next:NextFunction)=>{
  const roles:Role[] = req.body.roles;
    if(!roles) return res.sendStatus(401)
    const rolesArray = [...allowedRoles]
    const result =roles.map(role=>rolesArray.includes(role)).find(val=>val===true);
    if(!result) return res.sendStatus(401);
    next()
  }
}
// export const verifyUserExist = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user: User = convertUserData(req.body);
//   let check: boolean = await checkIfNameExists(user.name)
//   console.log(check);

//   req.body.role = "USER";
//   req.body.token = "";
//   req.body.admin = false;
//   if (check) return next(ApiErrors.AlreadyExists("User Already exists!"));
//   return next();
// };

export const verifyEmailExist = async (req: Request, res: Response, next: NextFunction) => {
  let user: User = req.body;
  let check = await checkEmailExists(user.email);
  if (check) {
    return next(ApiErrors.AlreadyExists("User Already exists!"))
  }
  return next();
}
// export const verifyLogin = async (
//   req: Request,
//   res: Response,
//   next: Function
// ) => {
//   let check = await checkIfLoginCorrect(
//     req.body.name,
//     hashUserPass(req.body.password)
//   );
//   if (check) return next();
//   else {
//     return next(ApiErrors.BadRequest("Wrong login or Password"));
//   }
// };

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.headers.authorization) {
    return next(ApiErrors.UnauthorizedError());
  }
  let headerAuthToken = req.headers.authorization?.split(" ")[1];
  try {
    const verify = jwt.verify(
      headerAuthToken,
      process.env.ACCESSSECRET! as string
    );
    console.log(verify);
  } catch (error) {
    console.log(error);
  }

  return next();
};

export const ErrorMiddleWare = (
  err: Error | ApiErrors,
  req: Request,
  res: Response,
  next: Function
) => {
  console.log(err);
  if (err instanceof ApiErrors) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  if (err instanceof MulterError)
    return res.status(400).json({ message: err.message });
  return res.status(500).json({ message: "Error accured" });
};

// export const ValidateImage = (req: Request, res: Response, next: Function) => {
//   let file = req.file;
//   const MaxIamgeSize: number|string = process.env.MAXIMAGESIZE! ||50_000 ;
//   if (!file) {
//     res.send({ ok: false });
//     next(ApiErrors.BadRequest("no file submited!"));
//   }
//   if (!fileIsImage(file?.filename)) {
//     next(ApiErrors.BadRequest("Bad filename, or extension of it"));
//   }
//   if (file?.size == null) {
//     next(ApiErrors.BadRequest("File size 0"));
//   } else if (file?.size >= MaxIamgeSize) {
//     next(ApiErrors.BadRequest("File is too big"));
//   }
//   next();
// };
