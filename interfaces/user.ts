//Implement tokenVersion to revoke all user tokens to be invalid
interface Tokens {
  access: string;
  refresh: string;
  tokenVersion: number;
}
export interface User {
  id: number;
  name: string;
  password: string;
  email?: string;
  confirmed:boolean;
  tokens?:Tokens
  role?: Role;
}
export enum Role {
  Admin = "ADMIN",
  User = "USER",
  Moderator = "MODERATOR"
}
