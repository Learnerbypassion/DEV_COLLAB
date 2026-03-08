import express from "express";
import authController from "../controllers/auth.controller.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";

const router = express.Router()


router.post('/register', authController.registerController)
router.post('/verify-email', authController.emailValidationController)
router.post('/resend-otp', authController.resendOtpController)
router.post('/login', verifyUser, authController.loginController)
router.post('/forgot-password', verifyUser, authController.forgotPasswordController)
router.post('/validate-forgot-password-otp', verifyUser, authController.validateForgotPasswordOtpController)
router.post('/create-new-password', verifyUser, authController.createNewPasswordController)



export default router;