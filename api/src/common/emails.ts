import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { readFileSync } from "fs";
import path from "path";
import { getConfig } from "./config";
import { compile } from "handlebars";

sgMail.setApiKey(getConfig().SENDGRID_API_KEY);

export const sendEmail = async (mailData: MailDataRequired) => {
  try {
    await sgMail.send(mailData);
  } catch (error) {
    console.error(error);
  }
};

export const getEmailHtml = (templateFilename: string, data: unknown) => {
  const template = readFileSync(
    path.join(
      __dirname,
      `constants/email-templates/${templateFilename}.handlebars`
    ),
    "utf8"
  );

  const compiledTemplate = compile(template);

  return compiledTemplate(data);
};
