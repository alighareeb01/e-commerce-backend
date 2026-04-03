import nodemailer from "nodemailer";
import { env } from "../../../config/env.service.js";
export const sendEmail = async (email, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT),
    secure: false,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const info = await transporter.sendMail({
    from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    text: text,
    html,
  });
  return info;
};
