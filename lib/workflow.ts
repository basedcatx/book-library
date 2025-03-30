import { Client as WorkFlowClient } from "@upstash/workflow";
import config from "@/lib/config";
import Emailer from "@emailjs/browser";

export const workFlowClient = new WorkFlowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

export const SendEmail = async ({
  email,
  subject,
  body,
  name,
  companyEmail = "basedcatx@gmail.com",
}: Record<string, string>) => {
  const emailParams = {
    name,
    body,
    subject,
    email,
    company_email: companyEmail,
  };

  await Emailer.send(
    config.env.emailJs.serviceId,
    config.env.emailJs.templateKey,
    emailParams,
  );
};
