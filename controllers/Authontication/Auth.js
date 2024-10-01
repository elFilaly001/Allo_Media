//required packages
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const OTP = require("./OTPGen.js")


//Used Models 
const User = require("../../models/Users.js");

//Node mailer
const mailer = require("./Mails.js");
const Roles = require("./Roles.js");

async function register(req, res) {
    try {
        const { username, email, password, phone, role } = req.body;

        const user = await User.findOne({ username, email, phone });;
        if (user) {
            res.status(400).json({ message: " User already exist" })
        } else {
            const findrole = await Roles.createRole(role)
            console.log(findrole);
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword, phone, role: findrole });
            // console.log(newUser);
            await newUser.save()
            const token = jwt.sign(
                { id: newUser.id },
                process.env.JWT_KEY,
                { expiresIn: "15m" }
            )
            await mailer.send_Verify_email(email, token)
            res.status(201).json({ message: "User registred successfully" });
        }
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }

}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        if (user.isVerified == false) {
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_KEY,
                { expiresIn: "15m" }
            )
            await mailer.send_Verify_email(email, token)
            return res.status(401).json({ error: 'please verify your account' });
        } else {
            // let OTPcode = generateOTP();
            // await mailer.T2FA(email, OTPcode)
            // const Rtoken = jwt.sign({
            //     userId: user._id,
            //     OTPcode: OTPcode
            // }, process.env.JWT_KEY, {
            //     expiresIn: "7m"
            // });
            // res.cookie('jwt', Rtoken, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     sameSite: 'None',
            //     maxAge: 7 * 24 * 60 * 1000 // 7 min 
            // });

            // let test = OTP.OTPExpires("15 m")
            let test = OTP.OTP(8, "1d", user)
            return res.status(201).json({ message: "code sent successfully" , token : test});
        }
    } catch (error) {
        res.status(400).json({ error });
    }
}

async function GetOTP(req, res) {
    try {
        const token = req.query.token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // Access the decoded information (like userId, OTPcode)
        const userId = decoded.userId;
        const user = await User.findById(userId)
        await OTP.VerifyOTP(user)
    } catch (error) {
        res.status(400).json({ error });
    }
}

async function ValidateOTPuser(req, res) {
    // try {
    //     const code = req.body.code
    //     const token = req.cookies.jwt
    //     // console.log(token);
    //     const decoded = jwt.verify(token, process.env.JWT_KEY);
    //     // Access the decoded information (like userId, OTPcode)
    //     const { userId, OTPcode } = decoded;
    //     console.log(userId, OTPcode);

    //     const user = await User.findById(userId);
    //     if (!user) {
    //         res.status(404).json({
    //             message: "user not found"
    //         })
    //     } else {

    //         if (code != OTPcode) {
    //             res.status(400).json({
    //                 message: "please insert the code sent in your email adress"
    //             })
    //         } else {
    //             res.clearCookie('jwt', {
    //                 httpOnly: true,
    //                 secure: process.env.NODE_ENV === 'production',
    //                 sameSite: 'None'
    //             });

    //             const token = jwt.sign({
    //                 userId: user._id,
    //                 role: user.role,
    //             }, process.env.JWT_KEY, {
    //                 expiresIn: "15d"
    //             });

    //             res.cookie('jwtLogin', token, {
    //                 httpOnly: true,
    //                 secure: process.env.NODE_ENV === 'production',
    //                 sameSite: 'None',
    //                 maxAge: 15 * 24 * 60 * 1000
    //             });
    //         }
    //         res.status(200).json({
    //             message: "login verified successfully"
    //         })
    //     }
    // } catch (error) {
    //     res.status(400).json({ error })
    // }

    try {
        const OTPinp = req.body.code;
        const token = req.query.token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // Access the decoded information (like userId, OTPcode)
        const userId = decoded.userId;
        const user = await User.findById(userId)
        const OTPcode = await OTP.VerifyOTP(user)
        console.log(OTPcode, OTPinp);

        if (OTPcode === OTPinp) {
            console.log("true");
            res.clearCookie('jwt', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None'
            });

            const token = jwt.sign({
                userId: user._id,
                role: user.role,
            }, process.env.JWT_KEY, {
                expiresIn: "15d"
            });

            res.cookie('jwtLogin', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 15 * 24 * 60 * 1000
            });

        } else {
            res.status(400).json({message : "please enter a valid code " })
        }
        res.status(200).json({
                        message: "login verified successfully"
                    })

    } catch (error) {
        res.status(400).json({ error });
    }
}

async function sendForgetPasswordEmail(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
            expiresIn: "10m"
        });
        await mailer.ForgetPasswordEmail(email, token);
        res.status(201).json({ message: "Email has been sent successfully" });
    } catch (error) {
        console.error("Error sending forget password email:", error);
        res.status(500).json({ message: "An error occurred while sending the email" });
    }
}

async function forgetPassword(req, res) {
    try {
        const { password, confirm_password } = req.body;
        const token = req.query.token
        const user_id = jwt.verify(token, process.env.JWT_KEY).id
        const user = await User.findById(user_id);
        console.log(user);

        if (!user) {
            res.status(400).json({ message: "User not found" })
        } else {
            if (password != confirm_password) {
                res.status(400).json({ message: "check passwords" })
            } else {
                const newPass = await bcrypt.hash(password, 10);
                user.password = newPass;
                await user.save()
            }
        }

    } catch (error) {
        console.error("Error sending forget password email:", error);
        res.status(500).json({ message: error });
    }
}
module.exports = {
    register,
    login,
    ValidateOTPuser,
    GetOTP,
    sendForgetPasswordEmail,
    forgetPassword
}