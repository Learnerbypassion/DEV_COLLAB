import userModel from "../models/user.model.js";

async function verifyUser(req, res, next) {
    const { email } = req.body;
	const user = await userModel.findOne({ email });
	if (!user || !user.isVerified) {
		return res.status(403).json({
			message: "User does not exist or the email is not verified",
			status: "Failed"
		})
	}
    req.user = user;
    next()
}

export default verifyUser;