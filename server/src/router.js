"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const recipes_json_1 = __importDefault(require("./Database_of_things/recipes.json"));
const router = (0, express_1.Router)();
const photos_folder = path_1.default.resolve(__dirname + "/Database_of_things/images/");
router.post("/login");
router.post("/registration");
router.get("/data", (req, res) => {
    try {
        // json_data[0].node.
        let id = Number(req.query.id);
        res.send(recipes_json_1.default[id].node);
    }
    catch (error) {
        res.status(400);
    }
    res.end();
});
exports.default = router;
