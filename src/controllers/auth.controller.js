import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs"
import emailService from "../services/email.service.js"
import jwt from "jsonwebtoken"
import { hashCredential } from "../utils/hashCredential.js";
import { compareCredential } from "../utils/compareCredential.js";
import otpService from "../services/otp.service.js";
import { genarateOtp } from "../utils/genarateOtp.js";

async function registerController(req, res) {
	const { name, email, password } = req.body;
	const isUserExist = await userModel.findOne({
		email
	})
	if (isUserExist) {
		if (!isUserExist.isVerified) {
			const otp = genarateOtp();

			isUserExist.otp = otp;
			isUserExist.otpExpiry = Date.now() + 5 * 60 * 1000;
			await isUserExist.save();

			await emailService.sendOtpEmail(
				isUserExist.email,
				isUserExist.name,
				otp
			);

			return res.status(200).json({
				message: "OTP re-sent. Please verify your email",
				email: isUserExist.email
			});
		}
		console.log("User already exists");
		return res.status(409).json({
			message: "User already exists"
		})
	}
	const hash = await hashCredential(password);
	const otp = await genarateOtp();
	console.log(otp);
	const hashOtp = await hashCredential(otp)
	const user = await userModel.create({
		name,
		email,
		password: hash,
		otp: hashOtp,
		otpExpiry: Date.now() + 5 * 60 * 1000 // 5 min expiry
	})
	try {
		await emailService.sendOtpEmail(user.email, user.name, otp);
		console.log("Otp sent");

	} catch (error) {
		console.log("otp can not be sent", error);
	}
	// attempt to deliver welcome email before finalizing response
	res.status(201).json({
		message: "User registered successfully, Verify OTP",
		email: user.email
	});
}
async function emailValidationController(req, res) {
	const { email, otp } = req.body;

	const user = await userModel.findOne({ email });

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	if (user.isVerified) {
		return res.status(409).json({
			message: "User already verified"
		})
	}
	try {
		await otpService.validateOtp(otp, user)
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: error.message
		});
	}
	const token = jwt.sign(
		{
			id: user._id,
			name: user.name
		},
		process.env.JWT_SECRET,
		{ expiresIn: "3d" }
	);

	const isProduction = false;

	res.cookie("token", token, {
		httpOnly: true,
		sameSite: isProduction ? "none" : "lax",
		secure: isProduction, // must be true in production (HTTPS)
		maxAge: 3 * 24 * 60 * 60 * 1000 // optional: 7 days
	});

	try {
		await emailService.sendRegistrationEmail(user.email, user.name);
	} catch (err) {
		console.log("Registration email error:", err);
	}

	res.status(200).json({
		message: "Email verified & account activated",
		name: user.name,
		email: user.email
	});
}
async function resendOtpController(req, res) {
	const { email } = req.body;
	const user = await userModel.findOne({ email });
	if (!user) {
		return res.status(404).json({
			message: "User does not exist, register now",
			status: "Failed"
		})
	}
	if (user.isVerified) {
		return res.status(400).json({
			message: "Email already verified",
		});
	}
	try {
		await otpService.sendOtp(user)
		return res.status(200).json({
			message: "New OTP sent successfully",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Server error",
		});
	}
}
async function loginController(req, res) {
	const { email, password } = req.body;
	const user = await userModel.findOne({
		email
	}).select("+password")
	const isPasswordValid = await compareCredential(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).json({
			message: "Wrong Password"
		})
	}
	const token = jwt.sign({
		userId: user._id,
		email: user.email
	}, process.env.JWT_SECRET, { expiresIn: "3d" });
	res.cookie("token", token)
	res.status(200).json({
		message: "Logged in successfully",
		user:{
			id: user._id,
			name: user.name,
			email: user.email
		},
		token
	})
}
async function forgotPasswordController(req, res) {
	const { email } = req.body;
	const user = await userModel.findOne({
		email
	}).select("+forgotPasswordVerification")
	user.forgotPasswordVerification = "otp_sent";
	await user.save();
	try {
		await otpService.sendOtp(user)
		return res.status(200).json({
			message: "For forgot password!! OTP sent successfully"
		})
	} catch (error) {
		console.log('Forgot password otp error', error);
		return res.status(500).json({
			message: "Server error"
		})
	}
}
async function validateForgotPasswordOtpController(req, res) {
	const { email, otp } = req.body;
	const user = await userModel
		.findOne({ email })
		.select("+forgotPasswordVerification");
	if (user.forgotPasswordVerification === "none") {
		return res.status(400).json({
			message: "Forgot password is not initiated"
		})
	}
	if (user.forgotPasswordVerification === "otp_verified") {
		return res.status(400).json({
			message: "OTP already validated, now create the password"
		})
	}
	try {
		await otpService.validateOtp(otp, user);
		return res.status(200).json({
			message: "OTP verified for forgot password",
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: error.message
		});
	}

}
async function createNewPasswordController(req, res) {
	const { email, newPassword } = req.body;
	const user = await userModel
		.findOne({ email })
		.select("+forgotPasswordVerification");
	if(!(user.forgotPasswordVerification === "otp_verified")){
		return res.status(400).json({
			message:"Forgot password is not initiated"
		})
	}
	const hashPassword = await hashCredential(newPassword);
	user.password = hashPassword;
	user.forgotPasswordVerification = "none";
	await user.save();
	res.status(200).json({
		message: "Password changed successfully"
	})
}
export default {
	registerController,
	emailValidationController,
	loginController,
	resendOtpController,
	forgotPasswordController,
	validateForgotPasswordOtpController,
	createNewPasswordController
}