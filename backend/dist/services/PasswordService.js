import bcrypt from "bcryptjs";
export class PasswordService {
    //hash password
    async hash(password) {
        return await bcrypt.hash(password, 10);
    }
    //Compare password
    async compare(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}
