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
exports.checkIfLoginCorrect = exports.checkIfNameExists = exports.docUsersCol = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const service_account_file_json_1 = __importDefault(require("../key/service-account-file.json"));
// const serviceAcc = require("C:/Users/mertwy/Downloads/example-site-acbd2-firebase-adminsdk-s3ob6-d337f78b59.json");
const fireApp = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(service_account_file_json_1.default),
});
const fireStore = firebase_admin_1.default.firestore();
const db = (0, firestore_1.getFirestore)();
exports.docUsersCol = db.collection("Users");
function checkIfNameExists(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let a = yield exports.docUsersCol.where("name", "==", `${name}`).get();
        // console.log(a.size);
        let b = a.size > 0 ? true : false;
        return b;
    });
}
exports.checkIfNameExists = checkIfNameExists;
function checkIfLoginCorrect(name, pass) {
    return __awaiter(this, void 0, void 0, function* () {
        let a = yield exports.docUsersCol.where("name", "==", `${name}`).where("password", "==", `${pass}`).get();
        let b = a.size == 1 ? true : false;
        return b;
    });
}
exports.checkIfLoginCorrect = checkIfLoginCorrect;
