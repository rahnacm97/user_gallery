import jwt from "jsonwebtoken";
export class TokenService {
    generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
            expiresIn: "24h",
        });
    }
    verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET || "secret");
    }
}
