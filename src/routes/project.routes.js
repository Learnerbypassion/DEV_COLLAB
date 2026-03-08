import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import projectController from "../controllers/project.controller.js";


const router = express.Router()
/* 
POST   /api/projects        → create project || done
GET    /api/projects        → get all projects || done 
GET    /api/projects/:id    → get single project || done
PATCH  /api/projects/:id    → update project ||Done
DELETE /api/projects/:id    → delete project ||Done
*/

router.get('/', authMiddleware, projectController.getAllProjectController)
router.post('/create-project', authMiddleware, projectController.createProjectController)
router.get('/:projectId', authMiddleware, projectController.getProjectByIdController)
router.patch('/:projectId', authMiddleware, projectController.updateProjectController)
router.delete('/:projectId', authMiddleware, projectController.deleteProjectController)


export default router; 