import admin, { database, ServiceAccount } from "firebase-admin";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { use } from "./router";
import { User } from "../../interfaces/user";
import serviceAcc from "../key/service-account-file.json"
// const serviceAcc = require("C:/Users/mertwy/Downloads/example-site-acbd2-firebase-adminsdk-s3ob6-d337f78b59.json");

const fireApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAcc),
});
const fireStore = admin.firestore();
const db = getFirestore();
export const docUsersCol = db.collection("Users");

export async function checkIfNameExists(name: string): Promise<boolean> {
  let a = await docUsersCol.where("name", "==", `${name}`).get();
  // console.log(a.size);
  let b = a.size > 0 ? true : false;
  return b;
}

export async function checkIfLoginCorrect(name:string,pass:string):Promise<boolean> {
  let a = await docUsersCol.where("name", "==", `${name}`).where("password","==",`${pass}`).get();
  let b = a.size == 1? true:false
  return b;
}