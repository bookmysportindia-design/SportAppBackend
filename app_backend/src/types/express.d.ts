import { JwtPayload } from "jsonwebtoken";

export interface AuthJwtPayload extends JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}
