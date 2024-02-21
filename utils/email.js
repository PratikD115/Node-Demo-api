const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2.define the email option
  let mailOptions = {
    from: "pratik dholariya <pratikdholariya97255@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: `<h2>HEllo Jee</h2> <p> File uploaded</p>`,
  };
  //3.actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
