// Import any needed model functions
import {
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject,
} from "../models/projects.js";
import {
  // getAllCategoriesForServiceProject,
  getCategoriesByServiceProjectId,
} from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";

const NUMBER_OF_UPCOMING_PROJECTS = 5;
// Define validation and sanitization rules for project form
// Define validation rules for project form
const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Project title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required")
    .isLength({ max: 1000 })
    .withMessage("Project description cannot exceed 1000 characters"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Project location is required")
    .isLength({ max: 200 })
    .withMessage("Project location cannot exceed 200 characters"),
  body("date")
    .notEmpty()
    .withMessage("Project requires date")
    .isISO8601()
    .withMessage("Date must be in valid date format"),
  body("organizationId")
    .notEmpty("Project organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
];

// Define any controller functions

// Shows the next upcoming service projects
const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  // console.log('Projects:', projects);
  const title = "Upcoming Service Projects";
  res.render("projects", { title, projects });
};

// Shows the details of a single service project
const showProjectDetailsPage = async (req, res) => {
  const projectID = req.params.id;
  const project = await getProjectDetails(projectID);
  const categories = await getCategoriesByServiceProjectId(projectID);
  const title = "Service Project Details";
  console.log("Project data:", project, categories);
  res.render("project", { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = " Add New Service Project";

  res.render("new-project", { title, organizations });
};

const processNewProjectForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // Redirect back to the new project form
    return res.redirect("/new-project/");
  }
  // Extract form data from req.body
  const { title, description, location, date, organizationId } = req.body;

  try {
    // Create the new project in the database
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "New service project created successfully!");
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error("Error creating new project:", error);
    req.flash("error", "There was an error creating the service project.");
    res.redirect("/new-project");
  }
};
// GET: edit-project
const showEditProjectForm = async (req, res) => {
  try {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    if (!projectDetails) {
      return res.status(404).render("404", { title: "Project not found" });
    }

    const title = "Edit Project";
    console.log("Project Update: ", projectId, projectDetails, organizations);
    res.render("edit-project", { title, projectDetails, organizations });
  } catch (error) {
    next(error);
  }
};
// POST: edit-project
const processEditProjectForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // Redirect back to the edit project form
    return res.redirect("/edit-project/" + req.params.id);
  }

  const projectId = req.params.id;
  const { title, description, location, date, organizationId } = req.body;
  console.log(title, description, location, date, organizationId);
  // does this try block help?
  try {
    await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId,
    );
    // set a success message
    req.flash("success", "Project updated successfully!");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error updating project:", error);
    req.flash("error", "There was an error updating the service project.");
    res.render(`/edit-project/${projectId}`);
  }
};

// Export any controller functions
export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
};
