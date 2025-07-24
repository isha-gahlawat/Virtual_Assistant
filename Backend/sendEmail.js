const nodemailer = require('nodemailer');
const dotenv= require ('dotenv');
dotenv.config()

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
     host: 'smtp.sendgrid.net',
     port: 587,
    auth: {
     user: process.env.SENDGRID_SMTP_USER,
    pass: process.env.SENDGRID_SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"AI Robo Support" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
