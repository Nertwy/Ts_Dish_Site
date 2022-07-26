"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
const recipes_json_1 = __importDefault(require("./recipes.json"));
const photos = fs_1.default.readdirSync("./images").length;
function download(uri, filename) {
    request_1.default.head(uri, (err, response, body) => {
        (0, request_1.default)(uri)
            .pipe(fs_1.default.createWriteStream(filename))
            .on("close", () => {
            console.log("done!");
        });
    });
}
const readImages = () => {
    recipes_json_1.default.forEach((value, index) => {
        download(value.node.imageUrl, "images/photo-" + index + ".png");
    });
};
const read_dish_names = () => {
    let names;
    recipes_json_1.default.forEach((element, index) => {
        // names.push(element.node.name);
        fs_1.default.appendFile("Names.txt", element.node.name + "\n", "utf-8", (err) => {
            if (err)
                throw err;
            // console.log("Complete!");
        });
    });
};
// read_dish_names();
readImages();
