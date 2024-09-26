const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: process.env.MAIL_PORT,
    host: "smtp.gmail.com",
       auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
         },
    secure: false,
});

async function send_Verify_email (targetEmail , token){
    await transporter.sendMail({
        from: 'Allo Media',
        to: targetEmail,
        subject: "validate Your email",
        html: `<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            font-size: 16px;
            color: #666666;
        }
        a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        a:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Email Verification</h1>
        <p>Hello,</p>
        <p>Thank you for signing up! Please click the button below to verify your email address:</p>
        <a href="http://localhost:3000/api/Auth/VerifyAcc?token=${token}" target="_blank">Verify Email</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Thank you, <br>Your Company Name</p>
    </div>
</body>`
    });
}

module.exports = send_Verify_email;