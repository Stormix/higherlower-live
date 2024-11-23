import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  TWITCH_CLIENT_ID: str(),
  TWITCH_CLIENT_SECRET: str(),
});
