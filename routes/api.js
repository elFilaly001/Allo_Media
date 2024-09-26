const express = require("express");
const router = express.Router();
const Auth = require("../controllers/Authontication/Auth.js")
const Verification = require("../controllers/Authontication/Verification.js")


router.post("/Auth/Register", Auth.register)
router.get("/Auth/VerifyAcc" , Verification.Verify_User)
// router.post("/Login", Auth.login)

module.exports = router;
