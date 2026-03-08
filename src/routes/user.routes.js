import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";
import multer from "multer"
const upload = multer()

const router = express.Router();
router.get('/',
    authMiddleware,
    userController.getProfileController
)
router.patch('/complete-profile',
    authMiddleware,
    upload.single("profileImage"),
    userController.completeProfileController
)
router.get('/search', authMiddleware, userController.searchUserController)
router.get('/:name', authMiddleware, userController.getUserByNameController )

export default router;