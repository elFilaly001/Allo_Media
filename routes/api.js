const express = require("express");
const router = express.Router();
const Auth = require("../controllers/Authontication/Auth.js")
const Verification = require("../controllers/Authontication/Verification.js")
const { validateRegister, validateLogin , validateEmail } = require('../middleware/Validation.js');


router.post("/Auth/Register", validateRegister,  Auth.register)
router.get("/Auth/VerifyAcc", Verification.Verify_User)
router.post("/Auth/Login", validateLogin, Auth.login)
router.post("/Auth/OTPcheck", Auth.ValidateOTPuser)
router.post("/Auth/FogetPassword",validateEmail , Auth.sendForgetPasswordEmail)
router.post("/Auth/ChangePassword" ,Auth.forgetPassword)

module.exports = router;
