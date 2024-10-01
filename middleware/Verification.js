//required packages
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Used Models (user)
const User = require("../models/Users.js");

async function Verify_User(req, res) {
    try {
        const UserToVerify = jwt.verify(req.query.token,process.env.JWT_KEY);
        const user = await User.findById( UserToVerify.id )
        console.log(UserToVerify.id);
        console.log(user);
        
        if(!user){
            res.status(404).json({message: "User not found"})
        return
        }else if (user.isVerified == true){
            res.status(200).json({message: "Email has already been verified."})
        return
        }else{
            user.isVerified = true
            await user.save()
            res.status(200).json({message: "Email has been verified."})
            return
        }
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    Verify_User
}