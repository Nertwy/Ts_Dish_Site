import { User } from "../../interfaces/user";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

import serviceAcc from "../key/service-account-file.json";
// const serviceAcc = require("C:/Users/mertwy/Downloads/example-site-acbd2-firebase-adminsdk-s3ob6-d337f78b59.json");

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: serviceAcc.client_email,
    projectId: serviceAcc.project_id,
    privateKey: serviceAcc.private_key
  })
});
admin.firestore();
export const db = getFirestore();
export const docUsersCol = db.collection("Users");

export async function checkIfNameExists(name: string): Promise<boolean> {
  let a = await docUsersCol.where("name", "==", `${name}`).get();
  // console.log(a.size);
  let b = a.size > 0 ? true : false;
  return b;
}
export const getUserByName = async (name: string): Promise<User> => {
  let a = await await docUsersCol.where("name", "==", `${name}`).get();
  if (!a) {
    throw new Error("No user Found!");
  } else if (a.size > 1) {
    throw new Error("Something Went Wrong - More than 1 user in DB");
  } else {
    let user: User = a.docs[0].data() as User;
    return user;
  }
  // let user: User = ().docs[0].data() as User;
};
export async function checkIfLoginCorrect(
  name: string,
  pass: string
): Promise<boolean> {
  let a = await docUsersCol
    .where("name", "==", `${name}`)
    .where("password", "==", `${pass}`)
    .get();
  let b = a.size == 1 ? true : false;
  return b;
}
export const checkifAdmin = async (user: User): Promise<boolean> => {
  let check = false;
  let a = await docUsersCol
    .where("name", "==", `${user.name}`)
    .where("admin", "==", true)
    .where("role", "==", "ADMIN")
    .get();
  a.size >= 1 ? (check = true) : (check = false);
  return check;
};
export const getUserIdByName = async (username: string) => {
  let id = await (
    await docUsersCol.where("name", "==", `${username}`).get()
  ).docs[0].id;
  return id;
};

export const writeAccessTokenToDB = async (id: string, AccessToken: string) => {
  docUsersCol.doc(id).update({
    tokens: {
      access: AccessToken
    }
  });
};
export const writeRefreshTokenToDB = async (
  id: string,
  RefreshToken: string
) => {
  docUsersCol.doc(id).update({
    tokens: {
      refresh: RefreshToken
    }
  });
};


