const User = require("../../models/Users.js");
const bcrypt = require("bcryptjs");
const mailer = require("./Mails.js");
const jwt = require("jsonwebtoken");


function generateOTP(length = 6) {
    return Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, '0');
}

function OTPExpires(time) {
    try {
        // romove spaces form the string 15 m => 15m
        let noSpaces = time.replace(/\s+/g, '');

        //get the last char to see if its m => minutes h => hours d => days
        const type = noSpaces[noSpaces.length - 1]

        //get the number in the string to Int 
        const timeToAdd = parseInt(time.slice(0, -1))

        //get the current date
        const currtime = Date.now();
        let Exptime

        if (typeof (timeToAdd) === "number") {
            switch (type) {
                case "m":  //  minutes
                    Exptime = currtime + (timeToAdd * 60 * 1000);
                    break;
                case "h":  //  hours
                    Exptime = currtime + (timeToAdd * 60 * 60 * 1000);
                    break;
                case "d":  //  days
                    Exptime = currtime + (timeToAdd * 24 * 60 * 60 * 1000);
                    break;
                default:  // Default 5 minutes
                    Exptime = currtime + (5 * 60 * 1000);
                    break;
            }
            return Exptime
        } else {
            return "Invalid timeToAdd, must be a string";
        }
    } catch (error) {
        throw error
    }
}

async function OTP(codeLength = 6, time, user) {
    const code = generateOTP(codeLength)
    const OTPcode = code + "" + OTPExpires(time) + "" + codeLength
    user.code =  OTPcode;
    await user.save();
    await mailer.T2FA(user.email, code)
    const token = jwt.sign({
        userId: user._id,
    }, process.env.JWT_KEY, {
        expiresIn: time
    });
    // console.log(token)
    return token
}

function DcryptOTP(code) {
    const numchar = code[code.length - 1]
    const OTPcode = code.slice(0 , numchar)
    const expiresIn = code.slice(numchar , code.length-1)
    const currtime = Date.now()
    if(currtime >= expiresIn){
        return null
    }else{
        return OTPcode
    }
}


async function VerifyOTP(user) {
    try {
        //extract code from 
        const code = user.code
        if (DcryptOTP(code) == null){
            user.code = null
            await user.save();
            throw "OTP code expired"
        }else{
            return DcryptOTP(code)
        }
    } catch (error) {
        throw error
    }
}



module.exports = {
    OTPExpires,
    OTP,
    VerifyOTP
}