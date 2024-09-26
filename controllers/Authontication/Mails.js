var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: process.env.MAIL_PORT,
    host: "smtp.gmail.com",
       auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
         },
    secure: true,
});

async function send_email (targetEmail){
    await transporter.sendMail({
        from: 'Allo Media',
        to: targetEmail,
        subject: "validate Your email",
        html: await ejs.renderFile(
            path.join(__dirname, '../views/email/', 'email.html')
        ),
    });
}

module.exports = send_email;