import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [30, "Name cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      // match: [
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      // ], 
      select: false,
    },

    bio: {
      type: String,
      maxlength: [200, "Bio cannot exceed 200 characters"],
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    profileImage: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordVerification: {
      type: String,
      enum: {
        values: ["none", "otp_sent", "otp_verified"],
        message: "Invalid password reset state"
      },
      default: "none",
      select: false
    },

    otp: {
      type: String,
    },

    otpExpiry: {
      type: Date,
    },

    createdProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    joinedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    role: {
      type: String,
      enum: {
        values: ["user", "admin", "superAdmin"],
        message: "Role must be either user or admin",
      },
      default: "user",
    },
  },
  { timestamps: true }
);
userSchema.index({
  username: "text",
  name: "text",
  bio: "text",
  skills: "text"
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
