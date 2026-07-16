// Import any needed model functions
// import { render } from "ejs";
import { getUpcomingProjects, getProjectDetails } from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions

// Shows the next upcoming service projects
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    // console.log('Projects:', projects);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

// Shows the details of a single service project
const showProjectDetailsPage = async (req,res) => {
    const projectID = req.params.id;
    const project = await getProjectDetails(projectID);
    const title = 'Service Project Details';
    console.log("Project data:", project);
    res.render('project', { title, project });
}

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage }