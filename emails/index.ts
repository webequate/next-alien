// emails/index.ts
import nodemailer from "nodemailer";
import { buildSendMail } from "mailing-core";
import path from "path";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendMail = buildSendMail({
  transport,
  defaultFrom: "WebEquate <webequate@gmail.com>",
  // Resolve config path from project root so it works in any working directory
  configPath: path.join(process.cwd(), "mailing.config.json"),
});

export default sendMail;
