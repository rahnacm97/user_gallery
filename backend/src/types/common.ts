import jwt from 'jsonwebtoken';

export interface AuthenticatedUser extends jwt.JwtPayload {
  userId: string;
}

export interface DecodedToken extends jwt.JwtPayload {
  userId: string;
}
