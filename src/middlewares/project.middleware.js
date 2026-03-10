import mongoose from "mongoose";
import projectModel from "../models/project.model.js";

const projectMiddleware = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId || req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({
      status: "Failed",
      message: "Invalid Project ID"
    });
  }

  const project = await projectModel.findById(projectId);
  if (!project) {
    return res.status(404).json({
      status: "Failed",
      message: "Project not found"
    });
  }

  req.project = project;
  next();
};

export default projectMiddleware;