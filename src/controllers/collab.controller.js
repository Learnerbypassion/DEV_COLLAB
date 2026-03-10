import collabModel from "../models/collab.model.js";
import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
async function collabReqController(req, res) {
    try {
        const receiverId = req.project.owner._id.toString();
        const projectId = req.project._id.toString();
        const senderId = req.user._id.toString()
        const { message } = req.body
        if (senderId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "Owner cannot request collaboration on their own project"
            });
        }

        if (req.project.collaborators.some(id => { id.toString() === senderId })) {
            return res.status(400).json({
                success: false,
                message: "You are already a collaborator"
            });
        }

        const existing = await collabModel.findOne({
            project: projectId,
            sender: senderId,
            receiver: receiverId,
            status: "pending"
        })
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Collaboration request already sent"
            });
        }

        const collabReq = await collabModel.create({
            sender: senderId,
            receiver: receiverId,
            project: projectId,
            message: message
        })
        res.status(201).json({
            message: "Collaboration request sent successfully",
            success: true,
            data: collabReq
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }

}

async function getAllRecievedRequestController(req, res) {
    try {
        const userId = req.user._id;
        const requests = await collabModel
            .find({
                receiver: userId,
                status: "pending"
            })
            .populate(
                "sender", "name email profileImage"
            )
            .populate(
                "project", "title description"
            )
        if (requests.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No pending requests"
            });
        }
       
        res.status(200).json({
            success: true,
            message: "Received collaboration requests fetched successfully",
            data: requests
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
}

async function acceptCollabController(req, res) {
    const collab = req.collab;
    if(collab.status !== "pending"){
        return res.status(400).json({
            message: "Request already processed",
            success: "flase"
        });
    }
    collab.status = "accepted";
    await collab.save();
    const project = await projectModel
    .findByIdAndUpdate(
        collab.project._id,
        {$addToSet : {collaborators: collab.receiver}}
    )
    const user = await userModel
    .findByIdAndUpdate(
        collab.sender,
        {
           $addToSet: { joinedProjects : collab.project._id} 
        }
    )
    res.status(200).json({
        message:"Collaboration request accepted",
        success: "true",
        data: project
    });
}
export default {
    collabReqController,
    getAllRecievedRequestController,
    acceptCollabController
}