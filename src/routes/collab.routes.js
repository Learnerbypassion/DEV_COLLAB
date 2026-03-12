import express from "express"
import projectMiddleware from "../middlewares/project.middleware.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import collabController from "../controllers/collab.controller.js"
import collabMiddleware from "../middlewares/collab.middleware.js"
/* 
POST   /api/collabs/request    DONE             → send a collaboration request to a user (body: receiverId, projectId, optional message)
GET    /api/collabs/requests       DONE         → get all collaboration requests received by the logged-in user
PATCH  /api/collabs/:collabId/accept   DONE     → accept a collaboration request (only receiver or project owner can accept)
PATCH  /api/collabs/:collabId/reject  DONE       → reject a collaboration request (only receiver or project owner can reject)
PATCH  /api/collabs/:collabId/leave    DONE     → leave a project collaboration (collaborator themselves)
GET    /api/collabs             DONE          → get all active collaborations of the logged-in user
GET    /api/collabs/:projectId   DONE           → get all active collaborators of a specific project
PATCH  /api/collabs/:collabId/complete      → mark the linked project as complete (only project owner)
DELETE /api/collabs/:collabId       DONE        → remove a collaborator from a project (only project owner)
*/
const router = express.Router()
router.post('/request', authMiddleware, projectMiddleware, collabController.collabReqController )
router.get('/received-requests', authMiddleware, collabController.getAllRecievedRequestController)
router.patch('/:collabId/accept', authMiddleware, collabMiddleware, collabController.acceptCollabController)
router.patch('/:collabId/reject', authMiddleware, collabMiddleware, collabController.rejectCollabController)
router.patch('/:collabId/leave', authMiddleware, collabController.leaveProjectController)
router.get('/joined', authMiddleware, collabController.getJoinedProjectsController)
router.get('/project/:projectId', authMiddleware, projectMiddleware, collabController.getallactivecollaboratorsController)
router.delete('/:collabId', authMiddleware, collabMiddleware, collabController.removeCollaboratorController)


export default router