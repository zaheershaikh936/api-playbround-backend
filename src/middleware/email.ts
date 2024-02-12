import 'dotenv/config';
import * as sgMail from '@sendgrid/mail';
import { Logger } from '@nestjs/common';

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: to, // Change to your recipient
      from: 'dev.apiplayground@gmail.com', // Change to your verified sender
      subject: subject,
      html: html,
    };
    const sendMale = await sgMail.send(msg);
    console.log(sendMale);
    return true;
  } catch (error) {
    Logger.error(error);
    return false;
  }
};
