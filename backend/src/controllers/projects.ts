import { Request, Response } from "express";
import { supabase } from "../app";

// Check section 1-2 in the README for more details on how to create this controller.

// Get project by ID
export const getProjectByID = async (req: Request, res: Response) => {
    const projectId = req.params.id
    const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
    if (error) {
        console.error("Error fetching project by ID:", error);
        return res.status(500).json({ error: "Failed to fetch project" });
    }
    return res.status(200).json(data);
};


// Get all projects
export const getAllProjects = async (req: Request, res: Response) => {
    const {data, error} = await supabase
    .from("projects")
    .select("*");
    if(error){
        console.error("Error fetching all projects:", error);
        return res.status(500).json({error: "Failed to fetch projects"});
    }
    return res.status(200).json(data);
}

// Create a new project
export const checkUserExists = async (userId: number): Promise<boolean> => {
    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single();

    if (error || !data) {
        return false;
    }
    return true;
};

export const createProject = async (req: Request, res: Response) => {
    const { project_name, project_manager_id, project_description } = req.body;
    const manager = await checkUserExists(project_manager_id);
    if (!manager) {
        return res.status(400).json({ error: "Manager ID does not exist" });
    }
    if (!project_name || !project_manager_id) {
        return res.status(400).json({ error: "Missing fields" });
    }
    const dataInsert = {
        project_name,
        project_manager_id,
        project_description
    }
    const {data, error } = await supabase
        .from("projects")
        .insert(dataInsert)
        .select("*")
        .single();
    if (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Failed to create project" });
    }
    return res.status(201).json(data);
}
    
// Update a project
export const updateProjectByID = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { project_name, project_manager_id, project_description } = req.body;
    if (project_manager_id !== undefined) {
        const manager = await checkUserExists(project_manager_id);
        if (!manager) {
            return res.status(404).json({ error: "Manager ID does not exist" });
        }
    }
    const dataUpdate = {
        ...(project_name !== undefined && {project_name}),
        ...(project_manager_id != undefined && {project_manager_id}),
        ...(project_description !== undefined && {project_description}),
    }

    const {data, error} = await supabase
    .from("projects")
    .update(dataUpdate)
    .eq("id", projectId)
    .select("*")
    .single();
    if(error){
        console.error("Error updating project:", error);
        return res.status(500).json({error: "Failed to update project"});
    }
    return res.status(200).json(data);
}

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
    const projectId = req.params.id;

    const { data, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .select("*")
        .single();

    if (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ error: "Failed to delete project" });
    }

    return res.json(data);
};