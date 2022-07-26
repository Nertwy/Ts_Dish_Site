import { User } from "../../interfaces/user";
import hash from "object-hash";


export function convertUserData(user: User): User {
  user.password = hash.sha1(user.password);
  return user;
}
