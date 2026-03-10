import express from "express"
import projectMiddleware from "../middlewares/project.middleware.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import collabController from "../controllers/collab.controller.js"
import collabMiddleware from "../middlewares/collab.middleware.js"
/* 
POST   /api/collabs/request                 → send a collaboration request to a user (body: receiverId, projectId, optional message)
GET    /api/collabs/requests                → get all collaboration requests received by the logged-in user
PATCH  /api/collabs/:collabId/accept        → accept a collaboration request (only receiver or project owner can accept)
PATCH  /api/collabs/:collabId/reject        → reject a collaboration request (only receiver or project owner can reject)
PATCH  /api/collabs/:collabId/leave         → leave a project collaboration (collaborator themselves)
PATCH  /api/collabs/:collabId/complete      → mark the linked project as complete (only project owner)
GET    /api/collabs                          → get all active collaborations of the logged-in user
GET    /api/collabs/:projectId              → get all active collaborators of a specific project
DELETE /api/collabs/:collabId               → remove a collaborator from a project (only project owner)
*/
const router = express.Router()
router.post('/request', authMiddleware, projectMiddleware, collabController.collabReqController )
router.get('/recieved-requests', authMiddleware, collabController.getAllRecievedRequestController)
router.patch('/:collabId/accept', authMiddleware, collabMiddleware, collabController.acceptCollabController)

export default router