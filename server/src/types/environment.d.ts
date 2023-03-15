export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ACCESSSECRET: string;
      REFRESHSECRET: string;
      MAXIMAGESIZE: number;
      DATABASESTRING: string;
    }
  }
}
