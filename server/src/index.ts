import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import cors, { CorsOptions } from "cors";
import { User } from "../../interfaces/user";
import hash from "object-hash";
import { convertUserData } from "./functions";
import jwt from "jsonwebtoken";
import {
  checkIfNameExists,
  checkIfLoginCorrect,
  docUsersCol,
} from "./database";
import { verifyToken } from "../middleware/middleware";
import router from "./router";

const host = "localhost";
const port: number = 8000;
const app = express();
app.use(express.json(), cors(),router);
app.get("/", async (req: Request, res: Response, next: NextFunction) => {});

app.post("/register", async (req: Request, res: Response) => {
  try {
    let userData: User = convertUserData(req.body);
    let check = await checkIfNameExists(userData.name);
    if (check) {
      res.status(400);
      throw new Error("User exists");
    }
    const token = jwt.sign(userData, "qwe", {
      expiresIn: "1h",
    });
    userData.token = token;
    docUsersCol.add(userData);
    //res.send("User registered sucsesfully!");
    res.json(userData.token);
  } catch (error) {
    console.log(error);
    res.send({ Error: "Username already exists" });
  } finally {
    res.end();
  }
});

app.post("/welcome", verifyToken, (req: Request, res: Response) => {
  res.status(200).send("Welcome");
});
app.post("/login", verifyToken, async (req: Request, res: Response) => {
  try {
    let userData: User = convertUserData(req.body);
    let check = await checkIfLoginCorrect(userData.name, userData.password);
    if (check) {
      res.send("Login Successful");
    } else {
      res.status(400);
      throw new Error("Wrong username or password");
    }
  } catch (error) {
    console.log(error);
    res.send({ Error: "Wrong username or password" });
  } finally {
    res.end();
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
