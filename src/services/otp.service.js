import { compareCredential } from "../utils/compareCredential.js";
import { genarateOtp } from "../utils/genarateOtp.js";
import { hashCredential } from "../utils/hashCredential.js";
import emailService from "./email.service.js";

async function sendOtp(user) {
	try {
		const otp = await genarateOtp();
		console.log("resend otp ->", otp);
		const hashOtp = await hashCredential(otp);
		user.otp = hashOtp;
		user.otpExpiry = Date.now() + 5 * 60 * 1000;
		await user.save();
		await emailService.sendOtpEmail(user.email, user.name, otp);
	} catch (error) {
		console.log("resendOTP controller error", error);
	}
}

async function validateOtp(otp, user) {
	const isOtpValid = await compareCredential(otp, user.otp)
	if (!isOtpValid) {
		throw new Error("Invalid OTP")
	}
	if (!user.otpExpiry || user.otpExpiry < Date.now()) {
		throw new Error("OTP Expired");
	}
	user.isVerified = true;
	user.otp = null;
	user.otpExpiry = null;
	if(user.forgotPasswordVerification === "otp_sent"){
		user.forgotPasswordVerification = "otp_verified";
	}
	await user.save();

}

export default {
	sendOtp,
	validateOtp
}