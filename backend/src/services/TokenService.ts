import jwt from "jsonwebtoken";
import { ITokenService } from "../interfaces/services/ITokenService";

export class TokenService implements ITokenService {
  //Token generation
  generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "24h",
    });
  }

  //Token verification
  verifyToken<T>(token: string): T {
    return jwt.verify(token, process.env.JWT_SECRET || "secret") as T;
  }
}
