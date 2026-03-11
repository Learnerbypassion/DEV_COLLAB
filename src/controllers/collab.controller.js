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
                message: "Owner cannot request collaboration on their own project",
                success: false
            });
        }
        if (req.project.collaborators.some(id => id.toString() === senderId)) {
            return res.status(400).json({
                message: "You are already a collaborator",
                success: false
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
                message: "No pending requests",
                data:[]
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
    try {
        const collab = req.collab;
        if (collab.status !== "pending") {
            return res.status(400).json({
                message: "Request already processed",
                success: false
            });
        }
        collab.status = "accepted";
        await collab.save();
            const [project, user ] = await Promise.all([
                projectModel
            .findByIdAndUpdate(
                collab.project._id,
                { $addToSet: { collaborators: collab.sender } }
            ) ,
            userModel
            .findByIdAndUpdate(
                collab.sender,
                {
                    $addToSet: { joinedProjects: collab.project._id }
                }
            )
            ])
        res.status(200).json({
            message: "Collaboration request accepted",
            success: true,
            project: project,
            user: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to accept the collaboration",
            success: false
        });
    }
}

async function rejectCollabController(req, res) {
    try {
        const collab = req.collab;
        if (collab.status !== "pending") {
            return res.status(400).json({
                message: "Request already processed",
                success: false
            });
        }
        collab.status = "rejected";
        await collab.save()
        res.status(200).json({
            message: "Collaboration request rejected",
            success: true,
            data: collab
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Unable to reject the collaboration",
            success:false
        })
    }
}

async function getJoinedProjectsController(req, res) {
    try {
        const user = await userModel
            .findById(req.user._id)
            .populate("joinedProjects", "title status")
        console.log(user.joinedProjects);
        res.status(200).json({
            message: "Joined projects",
            projects: user.joinedProjects
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Unable to fetch the joined projects",
            success: false
        })
    }
}

async function getallactivecollaboratorsController(req, res) {
    try {
        const collaboratorId = req.project.collaborators
        const collaborators = await userModel
            .find({
                _id: { $in: collaboratorId }
            })
            .select("name email github")
        if (collaborators.length === 0) {
            return res.status(200).json({
                message: "No collaborators present",
                collaborators: [],
                success: true
            });
        }
        res.status(200).json({
            message: "All collaborators found successfully",
            collaborators: collaborators,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch collaborators",
            success: false
        });
    }
}
export default {
    collabReqController,
    getAllRecievedRequestController,
    acceptCollabController,
    rejectCollabController,
    getJoinedProjectsController,
    getallactivecollaboratorsController
}