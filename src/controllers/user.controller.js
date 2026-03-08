import { json } from "express";
import userModel from "../models/user.model.js";
import { uploadProfilePic } from "../services/storage.service.js";

async function getProfileController(req, res) {
    const user = req.user;
    res.status(200).json({
        user: user
    })
}
async function completeProfileController(req, res) {
    const allowedFields = ['bio', 'skills', 'github', 'portfolio'];
    const updates = {};
    if (Array.isArray(req.body)) {
        req.body.forEach(item => {
            const { key, value } = item;
            if (allowedFields.includes(key) && value !== undefined) {
                updates[key] = key === "skills" && typeof value === "string" ? JSON.parse(value) : value;
            }
        });
    } else {
        allowedFields.forEach(key => {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        });
    }
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No fields provided to update" });
    }

    if (req.file) {
        try {
            const imageUrl = await uploadProfilePic(req.file.buffer);
            updates.profileImage = imageUrl.url
        } catch (err) {
            return res.status(500).json({ message: "Failed to upload profile image", error: err.message });
        }
    }
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, updates, { lean: true });
    delete updatedUser.otp;
    delete updatedUser.otpExpiry;
    delete updatedUser.password;
    delete updatedUser.forgotPasswordVerification;
    res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
    });
}

async function getUserByNameController(req, res) {
    try {
        const { name } = req.params;
        console.log(name);

        const user = await userModel.findOne({
            name: name
        }).select("-forgotPasswordVerification -otp -otpExpiry -role -isVerified -updatedAt -password")
        if (!user) {
            console.log(user);

            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            message: "User fetched successfully",
            user: user
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function searchUserController(req, res) {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search query required"
            });
        }
        const users = await userModel
            .find(
                { $text: { $search: q } },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .select("-forgotPasswordVerification -otp -otpExpiry -role -isVerified -updatedAt -password")
            .limit(10)

        res.status(200).json({
            success: true,
            results: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

}
export default {
    getProfileController,
    completeProfileController,
    getUserByNameController,
    searchUserController
}