import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import projectController from "../controllers/project.controller.js";


const router = express.Router()
/* 
POST   /api/project               → create project || done
GET    /api/project             → get all projects || done 
GET    /api/project/:projectId    → get single project || done
PATCH  /api/project/:projectId    → update project ||Done
DELETE /api/project/:projectId    → delete project ||Done
PATCH  /api/project/:projectId/complete      → mark the linked project as complete (only project owner)
*/

router.get('/', authMiddleware, projectController.getAllProjectController)
router.post('/create-project', authMiddleware, projectController.createProjectController)
router.get('/search', authMiddleware, projectController.searchProjectController)
router.get('/:projectId', authMiddleware, projectController.getProjectByIdController)
router.patch('/:projectId', authMiddleware, projectController.updateProjectController)
router.delete('/:projectId', authMiddleware, projectController.deleteProjectController)


export default router; 