//required packages
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Used Models (user)
const User = require("../../models/Users.js");

//Node mailer
const mailer = require("./Mails.js"); 

async function register(req, res) {
    try {
        const { username, email, password, phone } = req.body;
        const user = await User.findOne({ username, email, phone});;
        if(user){
            res.status(400).json({message: " User already exist"})
        }else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({username, email, password: hashedPassword, phone });
            await newUser.save()
            const token = jwt.sign(
                { id: newUser.id}, 
                process.env.JWT_KEY, 
                { expiresIn: "15m" }
            )
            await mailer(email, token)
            res.status(201).json({ message: "User registred successfully" });
        }
    } catch (error) {
        res.status(400).json({
            message : error
        })
    }

}

module.exports = {
    register
}