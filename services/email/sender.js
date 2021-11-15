const sgMail = require("@sendgrid/mail");
// const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({ ...msg, from: process.env.FIRST_SENDER_EMAIL });
  }
}

// class CreateSenderNodemailer {
//   async send(msg) {
//     const config = {
//       host: "smtp.meta.ua",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.SECOND_SENDER_EMAIL,
//         pass: process.env.PASSWORD,
//       },
//     };
//     const transporter = nodemailer.createTransport(config);
//     return await transporter.sendMail({
//       ...msg,
//       from: process.env.SECOND_SENDER_EMAIL,
//     });
//   }
// }

module.exports = { CreateSenderSendGrid, };
