import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sss3232829@gmail.com",
    pass: "ywaxyxzuhsunaukw",
  },
});

export const emailAdapter = {
  async sendEmail(email: string, subject: string, code: string) {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "Server <sss3232829@gmail.com>", // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: `https://some-front.com/confirm-registration?code=${code}`,
      //html: `<div><a href=https://some-front.com/confirm-registration?code=${code}>https://some-front.com/confirm-registration?code=${code}</a></div>`, // html body
    });

    return info;
  },

  async sendEmail2(email: string, subject: string, code: string) {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "Server <sss3232829@gmail.com>", // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: code,
    });

    return info;
  },
};
