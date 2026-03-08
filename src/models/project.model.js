import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    techStack: {
      type: [String],
      default: []
    },

    githubRepo: {
      type: String,
      required: true
    },

    liveLink: {
      type: String
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    ],

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active"
    }
  },
  { timestamps: true }
);
projectSchema.index({
  title: "text",
  description: "text",
  techStack: "text"
});

const projectModel = mongoose.model("Project", projectSchema);

export default projectModel;