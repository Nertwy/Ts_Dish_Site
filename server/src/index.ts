import express from "express";
import cors from "cors";
import { ErrorMiddleWare } from "../middleware/middleware";
import router from "./router";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql"
const port: string | number = process.env.PORT || 8000;
export const app = express();

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);


app.use(
  express.json(),
  // graphqlHTTP({
  //   schema
  // }),
  cors({ credentials: true, origin: "http://localhost:3000" }),
  cookieParser(),
  router,
  ErrorMiddleWare
);
// app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(__dirname))
app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port,  () => {

  console.log(`Listening on port ${port}`);
});
