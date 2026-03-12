import mongoose from "mongoose";

const collabSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "left", "removed"],
    default: "pending"
  },
  message: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const collabModel = mongoose.model("Collab", collabSchema);
export default collabModel;