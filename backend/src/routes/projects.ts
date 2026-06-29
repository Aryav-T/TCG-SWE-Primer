
import { Router } from "express";
import * as projectsController from "../controllers/projects";

const router = Router();

// Check section 1-2 in the README for more details on how to create these routes.
router.get("/all", projectsController.getAllProjects);

router.get("/:id", projectsController.getProjectByID);

router.post("/", projectsController.createProject);

router.put("/:id", projectsController.updateProjectByID);

router.delete("/:id", projectsController.deleteProject);

export default router;
