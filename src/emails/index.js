// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendWelcome = (email, name) => {
//   const msg = {
//     to: email, // Change to your recipient
//     from: "thepho4life@gmail.com", // Change to your verified sender
//     subject: "Thanks for joining",
//     html: "<strong>Welcome to my Task Manager App</strong>"
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch(error => {
//       console.error(error);
//     });
// };

// module.exports = {
//   sendWelcome
// };
