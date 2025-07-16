const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dulanjanassd@gmail.com', // replace with your email
    pass: 'duuc onqi xsmm wfph' // app password
  }
});

const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: 'dulanjanassd@gmail.com', // replace with your email
    to,
    subject: 'Welcome to Our System!',
    text: `Hello ${name},\n\nWelcome to our system! We are glad to have you on board.\n\nBest regards,\nThe Team`
  };
  return transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail };
