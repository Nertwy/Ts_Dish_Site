"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const functions_1 = require("./functions");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("./database");
const middleware_1 = require("../middleware/middleware");
const router_1 = __importDefault(require("./router"));
const host = "localhost";
const port = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json(), (0, cors_1.default)(), router_1.default);
app.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { }));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userData = (0, functions_1.convertUserData)(req.body);
        let check = yield (0, database_1.checkIfNameExists)(userData.name);
        if (check) {
            res.status(400);
            throw new Error("User exists");
        }
        const token = jsonwebtoken_1.default.sign(userData, "qwe", {
            expiresIn: "1h",
        });
        userData.token = token;
        database_1.docUsersCol.add(userData);
        //res.send("User registered sucsesfully!");
        res.json(userData.token);
    }
    catch (error) {
        console.log(error);
        res.send({ Error: "Username already exists" });
    }
    finally {
        res.end();
    }
}));
app.post("/welcome", middleware_1.verifyToken, (req, res) => {
    res.status(200).send("Welcome");
});
app.post("/login", middleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userData = (0, functions_1.convertUserData)(req.body);
        let check = yield (0, database_1.checkIfLoginCorrect)(userData.name, userData.password);
        if (check) {
            res.send("Login Successful");
        }
        else {
            res.status(400);
            throw new Error("Wrong username or password");
        }
    }
    catch (error) {
        console.log(error);
        res.send({ Error: "Wrong username or password" });
    }
    finally {
        res.end();
    }
}));
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
