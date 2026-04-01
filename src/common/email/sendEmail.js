import nodemailer from "nodemailer";
export const sendEmail = async (email, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "ghareeeb874@gmail.com",
      pass: "fqfy mjll xtoe afjv",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const info = await transporter.sendMail({
    from: '"Aly abdullkareem" <ghareeeb874@gmail.com>',
    to: email,
    subject: subject,
    text: text,
    html,
  });
  return info;
};
