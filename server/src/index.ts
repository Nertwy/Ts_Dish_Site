import express from "express";
import cors, { CorsOptions } from "cors";
import { ErrorMiddleWare } from "../middleware/middleware";
import router from "./router";
import "dotenv/config";
import cookieParser from "cookie-parser";

const port: string | number = process.env.PORT || 8000;
export const app = express();
const corsOptions = cors({
  origin: ['*', "http://localhost:3000"],
  methods: "GET,POST,PUT,PATCH,HEAD,DELETE",
  credentials: true,
  // optionsSuccessStatus: 200,
})

app.use(
  corsOptions,
  express.json(),
  cookieParser(),
  router,
  ErrorMiddleWare,
);
// app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(__dirname))
app.get("/", (req, res) => {
  res.json({ asd: "HI" })
  // res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
