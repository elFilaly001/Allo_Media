const express = require("express");
const router = express.Router();
const Auth = require("../controllers/Athontication/Auth.js")


router.post("/Register", Auth.register)
// router.post("/Login", Auth.login)

module.exports = router;
