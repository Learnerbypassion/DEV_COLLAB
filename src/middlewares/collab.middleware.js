import mongoose from "mongoose";
import collabModel from "../models/collab.model.js";
import projectModel from "../models/project.model.js";

const collabMiddleware = async (req, res, next) => {
   try {

      const { collabId } = req.params;
      console.log(req.params);
      
      if (!mongoose.Types.ObjectId.isValid(collabId)) {
         return res.status(400).json({
            message: "Invalid collaboration id",
            success: false
         });
      }

      const collab = await collabModel
         .findById(collabId)
         .populate("project", "owner collaborators");

      if (!collab) {
         return res.status(404).json({
            message: "Collaboration request not found",
            success: false
         });
      }
      const userId = req.user._id;
     if (!collab.project.owner.equals(userId)) {
         return res.status(403).json({
            message: "Only project owner can access the collaboration requests",
            success: false
         });
      }
      req.collab = collab;
      next();
   } catch (error) {
      res.status(500).json({
         message: "Server Error",
         success: false
      });
   }
}

export default collabMiddleware;