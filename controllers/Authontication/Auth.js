//required packages
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Used Models 
const User = require("../../models/Users.js");

//Node mailer
const mailer = require("./Mails.js");
const Roles = require("./Roles.js");
const { finished } = require("nodemailer/lib/xoauth2/index.js");
// const { any } = require("joi");


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
            return res.status(401).json({ error: 'user not found' });
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
            let OTPcode = generateOTP();
            await mailer.T2FA(email, OTPcode)
            res.status(200).json({ message: "code sent successfully" });
        }
        const Rtoken = jwt.sign({
            userId: user._id,
            OTPcode: OTPcode
        }, process.env.JWT_KEY, {
            expiresIn: "7m"
        });
        res.cookies('jwt', Rtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 1000 // 7 min 
        });
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
}

function generateOTP(length = 6) {
    return Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, '0');
}


async function ValidateOTPuser(req, res) {
    const code = req.body
    const token = req.cookies.jwt
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // Access the decoded information (like userId, OTPcode)
    const { userId, OTPcode } = decoded;
    console.log(userId, OTPcode);
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None'
    });
}

async function sendForgetPassEmail(req, res){
    const email = req.body

    const user  = await User.findOne({email : email});

    if (!user){
        return res.status(400).json({message : "user does not exist"})
    }

    const token = jwt.sign({id : user._id} , process.env.JWT_KEY, {
        expiresIn: "10m"
    })

    
}

async function forgetPassword (req , res){

}

module.exports = {
    register,
    login,
    ValidateOTPuser,
    sendForgetPassEmail,
    forgetPassword
}