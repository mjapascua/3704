const nodemailer = require("nodemailer");

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.MAIL_OAUTH_CLIENTID,
    clientSecret: process.env.MAIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.MAIL_OAUTH_REFRESH_TOKEN,
  },
});

const outlookTransporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.OUTLOOK_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

/* const mailViaOutlook = async (options) => {
  const res = await outlookTransporter.sendMail(options);
  return res.response;
};

const mailViaGmail = async (options) => {
  await gmailTransporter.sendMail(options, (error, info) => {
    if (error) {
      return "Gmail sending failed " + error;
    }
    console.log("Email sent successfully via " + process.env.OUTLOOK_USERNAME);
    return 200;
  });
};
 */
module.exports = { outlookTransporter, gmailTransporter };
