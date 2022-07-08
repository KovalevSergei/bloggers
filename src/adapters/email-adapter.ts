import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "s3232829@gmail.com",
    pass: "vnahlsvuqfyyxpqn",
  },
});

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "Server <s3232829@gmail.com>", // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });

    return info;
  },
};
