import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
async function authMiddleware(req, res, next) {
   const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
   if (!token) {
      return res.status(401).json({
         message: "Unauthorized"
      })
   }
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel
      .findById( decoded.userId )
      .populate("createdProjects", "title _id");
      if (!user) {
         return res.status(401).json({
            message: "User not found"
         })
      }
      const userData = user.toObject();
      delete userData.otp;
      delete userData.otpExpiry;
      delete userData.password;
      delete userData.forgotPasswordVerification;
      req.user = userData;
      return next()
   } catch (error) {
      return res.status(401).json({
         message: "Token is not valid"
      })
   }
}


export default authMiddleware