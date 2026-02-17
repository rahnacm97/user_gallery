import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export class NodemailerConfig {
    _transporter;
    constructor() {
        this._transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    get transporter() {
        return this._transporter;
    }
    get emailUser() {
        return process.env.EMAIL_USER;
    }
}
