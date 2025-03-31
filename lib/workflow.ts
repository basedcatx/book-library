import { Client as WorkFlowClient } from "@upstash/workflow";
import config from "@/lib/config";
import nodemailer, { SentMessageInfo } from "nodemailer";
import { EMAIL_TEMPLATE } from "@/app/constants";

export const workFlowClient = new WorkFlowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.env.google.username,
    pass: config.env.google.password,
  },
  tls: {
    rejectUnauthorized: false, // Disables strict SSL/TLS verification
  },
});

export const SendEmail = async ({
  email,
  subject,
  body,
  name,
  companyEmail = "basedcatx@gmail.com",
}: Record<string, string>) => {
  const info: SentMessageInfo = await transporter.sendMail({
    from: '"INFO @ The Book Library" <basedcatx@book-library-lac.vercel.app>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line text body
    html: EMAIL_TEMPLATE({
      company_email: companyEmail,
      body,
      name,
    }), // html body
  });

  if (info?.messageId) {
    return { success: true, message_id: info.messageId };
  }

  throw new Error("Failed to send email email message", info.error.toString());
};
