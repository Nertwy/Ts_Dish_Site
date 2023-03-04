import { User } from "../../interfaces/user";
import hash from "object-hash";

export function convertUserData(user: User): User {
  user.password = hash.sha1(user.password);
  return user;
}
export const hashUserPass = (pass: string): string => {
  return hash.sha1(pass);
};
export const checkPropertiesNull = (obj: Object):boolean => {
  let a = Object.values(obj).every((value) => {
    if (value === null || value === undefined || value === "") {
      //false - there is null undefined or empty string
      return false;
    } else {
      //true - result is ok
      return true;
    }
  });
  return a;
};
export const fileIsImage = (filename: string|undefined): boolean => {
  let extension = filename?.split(".").pop();
  if(extension === "png" || extension === "jpeg" || extension === "gif" || extension ==="jpg") return true;
  return false
};

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}