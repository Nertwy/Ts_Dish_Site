import fs from "fs";
import request from "request";
import json_all from "./recipes.json";
const photos = fs.readdirSync("./images").length;
function download(uri: string, filename: fs.PathLike) {
  request.head(uri, (err, response, body) => {
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on("close", () => {
        console.log("done!");
      });
  });
}
const readImages = () => {
  json_all.forEach((value, index) => {
    download(value.node.imageUrl, "images/photo-" + index + ".png");
  });
};
const read_dish_names = () => {
  let names: string[];
  json_all.forEach((element, index) => {
    // names.push(element.node.name);
    fs.appendFile("Names.txt", element.node.name + "\n", "utf-8", (err) => {
      if (err) throw err;
      // console.log("Complete!");
    });
  });
};
// read_dish_names();
readImages();
