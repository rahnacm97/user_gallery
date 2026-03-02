import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export class NodemailerConfig {
  private _transporter: Transporter;

  constructor() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.warn("EMAIL_USER or EMAIL_PASS environment variables are missing.");
    }

    this._transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  get transporter(): Transporter {
    return this._transporter;
  }

  get emailUser(): string | undefined {
    return process.env.EMAIL_USER;
  }
}
