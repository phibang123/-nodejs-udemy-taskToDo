const sgMail = require("@sendgrid/mail")



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
//   to: "phibang7899@gmail.com",
//   from: "bang33q@outlook.com.vn",
//   subject: "Fuck boi quan 10",
//   text: "Fuck boi quận 10 chơi tinder cua gái"

// })

const sendWellcomeEmail = (email,name) =>
{
  sgMail.send({
    to: email,
    from: "bang33q@outlook.com.vn",
    subject: "Thanks for joining in!",
    text: `Wellcome to the app, ${ name }. Let me know how you get along with me!`,
    html: "<div></div>"
    })

}


const sendCancelationEmail = (email, name) =>
{
  sgMail.send({
    to: email,
    from: "bang33q@outlook.com.vn",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${ name }. I hope to see back sometime tou soon`,
    })
}

module.exports = {
  sendWellcomeEmail,
  sendCancelationEmail
}