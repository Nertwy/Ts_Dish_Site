"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, "qwe");
        req.body.token = decode;
    }
    catch (error) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};
exports.verifyToken = verifyToken;
