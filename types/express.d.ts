// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from "express";

export type UserType = {
  "custom:uuid": string;
  sub: string;
  email_verified: boolean;
  iss: string;
  "cognito:username": string;
  given_name: string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  exp: number;
  iat: number;
  family_name: string;
  jti: string;
  email: string;
};

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Request {
      user?: UserType;
    }
  }
}
