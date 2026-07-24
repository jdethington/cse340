import express from "express";

import { showHomePage } from "./controllers/index.js";
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";
import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
} from "./controllers/projects.js";
import {
  showCategoriesPage,
  showCategoryPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
// Route for new project page
router.get("/new-project", showNewProjectForm);
// Route to handle new project form submission
router.post("/new-project", projectValidation, processNewProjectForm);
router.get("/category/:id", showCategoryPage);
router.get("/new-organization", showNewOrganizationForm);
// Route to display the edit organization form
router.get("/edit-organization/:id", showEditOrganizationForm);
// Route to handle new organization form submission
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm,
);
// Route to handle the edit organization form submission
router.post(
  "/edit-organization/:id",
  organizationValidation,
  processEditOrganizationForm,
);
// Routes to handle the assign categories to project form
router.get("/assign-categories/:projectId", showAssignCategoriesForm);
router.post("/assign-categories/:projectId", processAssignCategoriesForm);
// Routs to handle the update (edit) project form
router.get("/edit-project/:id", showEditProjectForm);
router.post("/edit-project/:id", projectValidation, processEditProjectForm);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
