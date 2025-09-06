const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASS}`
    }
});

async function sentMail(to, subject, text, html) {
    const forwarMail = await transporter.sendMail({
        from: `${process.env.EMAIL}`,
        to: to,
        text:text,
        html:html
    })
   return forwarMail;
}
module.exports = sentMail    