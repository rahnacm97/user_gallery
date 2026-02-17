import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export class NodemailerConfig {
  private _transporter: Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
