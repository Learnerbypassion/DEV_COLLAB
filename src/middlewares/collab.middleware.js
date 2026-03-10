import mongoose from "mongoose";
import collabModel from "../models/collab.model.js";
import projectModel from "../models/project.model.js";

const collabMiddleware = async (req, res, next) => {
   try {

      const { collabId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(collabId)) {
         return res.status(400).json({
            success: false,
            message: "Invalid collaboration id"
         });
      }

      const collab = await collabModel
         .findById(collabId)
         .populate("project", "owner collaborators");

      if (!collab) {
         return res.status(404).json({
            success: false,
            message: "Collaboration request not found"
         });
      }
      const userId = req.user._id;
     if (!collab.project.owner.equals(userId)) {
         return res.status(403).json({
            success: false,
            message: "Only project owner can accept collaboration requests"
         });
      }
      req.collab = collab;
      next();
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server Error"
      });
   }
}

export default collabMiddleware;