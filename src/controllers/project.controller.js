import mongoose from "mongoose";
import projectModel from "../models/project.model.js"
import userModel from "../models/user.model.js"

async function createProjectController(req, res) {
    try {
        const { title, description, techStack, githubRepo, liveLink } = req.body
        if (!title || !description || !githubRepo) {
            return res.status(400).json({
                message: "Title, Description and GitHub-Repo link required",
                status: "failed"
            });
        }
        const isProjectExist = await projectModel.findOne({
            githubRepo
        }).populate("owner", "name email")
        if (isProjectExist) {
            return res.status(409).json({
                message: "Project already exist",
                project: isProjectExist,
                status: "failed"
            })
        }
        const project = await projectModel.create({
            title,
            description,
            techStack,
            githubRepo,
            liveLink,
            owner: req.user._id
        })
        await userModel
            .findByIdAndUpdate(
                req.user._id,
                { $push: { createdProjects: project._id } },
                { returnDocument: 'after' }
            )
        res.status(201).json({
            message: "New project created",
            status: "Success",
            project
        });
    } catch (err) {
        console.log(err.message);
        console.log(err);
        return res.status(500).json({
            message: "Project creation error",
            status: "failed",
            error: err.message
        })
    }
}

async function getAllProjectController(req, res) {
    try {
        const { tech, title } = req.query;

        const filter = {};
        if (tech) filter.techStack = { $regex: tech, $options: "i" };
        if (title) filter.title = { $regex: title, $options: "i" }; // case-insensitive

        const projects = await projectModel
            .find(filter)
            .populate("owner", "name username email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "Success",
            total: projects.length,
            projects
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: "Failed",
            message: "Error fetching projects",
            error: err.message
        })
    }
}

async function getProjectByIdController(req, res) {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
                status: "Failed"
            })
        }
        const project = await projectModel
            .findById(projectId)
            .populate("owner", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Invalid Project Id",
                status: "Failed"
            })
        }

        res.status(200).json({
            message: "Project fetched successfully",
            status: "Success",
            project
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "Error fetching project",
            status: "Failed",
            error: err.message
        })
    }
}

async function updateProjectController(req, res) {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
            message: "Invalid Project ID",
            status: "Failed"
        });
    }
    const allowedUpdates = ["title", "description", "techStack", "status"];
    const updates = {};
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    })
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            message: "No fields provided for update",
            status: "Failed"
        })
    }
    const project = await projectModel
        .findOneAndUpdate(
            { _id: projectId, owner: req.user._id },
            { $set: updates },
            { returnDocument: "after" }
        );
    if (!project) {
        return res.status(404).json({
            message: "Project not found or Only owner can update the project",
            status: "Failed"
        })
    }
    res.status(200).json({
        message: "Project updated successfully",
        status: "Success",
        project
    });
}

async function deleteProjectController(req, res) {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid Project ID",
                status: "Failed"
            });
        }
        const project = await projectModel
            .findOneAndDelete(
                { _id: projectId, owner: req.user._id },
            )
        if (!project) {
            return res.status(404).json({
                message: "Project not found or Only owner can delete the project",
                status: "Failed"
            });
        }
        await userModel.findByIdAndUpdate(req.user._id, {
            $pull: { createdProjects: projectId }
        });
        res.status(200).json({
            message: "Project deleted successfully",
            status: "Success"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            status: "Failed"
        });
    }
}

async function searchProjectController(req, res) {
    try {
        const { query } = req.query;  
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }
        const projects = await projectModel
            .find(
                { $text: { $search: query } },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .populate("owner", "name email github profileImage")
        if (!projects.length) {
            return res.status(200).json({
                success: true,
                message: "No projects found",
                count: 0,
                projects: []
            });
        }
        return res.status(200).json({
            message:"Fetched Result",
            count: projects.length,
            projects,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error searching projects",
            error: error.message
        });
    }
}
export default {
    createProjectController,
    getAllProjectController,
    getProjectByIdController,
    updateProjectController,
    deleteProjectController,
    searchProjectController
} 