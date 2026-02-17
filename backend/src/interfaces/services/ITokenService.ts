export interface ITokenService {
  generateToken(payload: object): string;
  verifyToken<T>(token: string): T;
}
