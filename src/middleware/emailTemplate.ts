import { sendMail } from 'src/middleware/email';
type welcomeEmailT = {
  name: string;
  to: string;
  project?: string;
};
export const welcomeEmail = ({ name, to }: welcomeEmailT) => {
  const data = {
    subject: 'Welcome to Api playground!',
    html: `<p><span>Dear <b>${name}</b>,</span></br></br><span>Welcome to API Playground! We're thrilled to have you on board and excited for the journey ahead.</span></br></br><span>API Playground is an open-source, free-to-use API testing application designed to streamline collaboration within your team. With our platform, you can easily work on REST APIs, test them, and seamlessly share your progress with your office coworkers.</span></br></br><span>You're all set to begin your journey with us. Start exploring and collaborating on your project right away!</span></br></br><span>Once again, welcome to the API Playground community! We're committed to making your experience with us as smooth and productive as possible. If you have any questions or need assistance, don't hesitate to reach out to us on <b> <u>dev.apiplayground@gmail.com</u></b>. We're here to support you every step of the way.</span></br></br><span>Thank you for choosing API Playground. <b>Let's create something incredible together!</b></span></br></br><span>Best regards,</span></br></br><span>API Playground</span></p>`,
  };
  sendMail(to, data.subject, data.html);
};

export const inviteEmail = ({ project, name, to }: welcomeEmailT) => {
  const data = {
    subject: `Join ${project} on API Playground!`,
    html: `<p><span>Dear <b>${name}</b>,</span></br></br><span>We're excited to invite you to join ${project} on API Playground! Our platform is perfect for collaborating on REST APIs and testing them with your team.</span></br></br><span>Get started now by visiting our website: <a href="https://api-playground-6mnx3idx0-zaheershaikh936.vercel.app">apiplayground.com</a></span></br></br><span>Let's make ${project} a success together!</span></br></br><span>Thank you for choosing API Playground. <b>Let's create something incredible together!</b></span></br></br><span>Best regards,</span></br></br><span>API Playground</span></p>`,
  };
  sendMail(to, data.subject, data.html);
};
