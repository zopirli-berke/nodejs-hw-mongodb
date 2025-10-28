import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TEMPLATES_DIR } from '../constants/index.js';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (options) => {
  const { to, subject, template, data } = options;

  const templatePath = path.join(TEMPLATES_DIR, template);
  const source = await fs.readFile(templatePath, 'utf-8');

  const compiledTemplate = handlebars.compile(source);
  const html = compiledTemplate(data);

  const mailOptions = {
    from: env.SMTP_FROM,
    to,
    subject,
    html,
  };
  return await transporter.sendMail(mailOptions);
};
