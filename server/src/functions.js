"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUserData = void 0;
const object_hash_1 = __importDefault(require("object-hash"));
function convertUserData(user) {
    user.password = object_hash_1.default.sha1(user.password);
    return user;
}
exports.convertUserData = convertUserData;
