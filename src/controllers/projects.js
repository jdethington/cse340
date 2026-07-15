// Import any needed model functions
import { getAllProjects } from "../models/projects.js";

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    // console.log('Projects:', projects);
    const title = 'Service Projects';
    res.render('projects', { title, projects });
};

// Export any controller functions
export { showProjectsPage }