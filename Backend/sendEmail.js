const nodemailer = require('nodemailer');
const dotenv= require ('dotenv');
dotenv.config()

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"AI Robo Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
