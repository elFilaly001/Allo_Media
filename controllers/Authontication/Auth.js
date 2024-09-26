//required packages
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Used Models (user)
const User = require("../../models/Users.js");


async function register(req, res) {
    try {
        const { username, email, password, phone } = req.body;
        const user = await User.findOne({ username, email, phone});;
        if(user){
            res.status(500).json({message: " User already exist"})
        }else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({username, email, password: hashedPassword, phone });
            await newUser.save()
            console.log(newUser);
            res.status(200).json({ message: "User registred successfully" });
        }
    } catch (error) {
        res.status(500).json({
            message : "Registration failed"
        })
    }

}