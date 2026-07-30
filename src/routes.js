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
  showNewCategoryForm,
  processNewCategoryForm,
  categoryValidation,
  showEditCategoryForm,
  processEditCategoryForm,
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";
import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  showDashboard,
  requireLogin,
  // ========================================================================
  requireRole,
  // ========================================================================
} from "./controllers/users.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryPage);
// ========================================================================
// --------------------------------------------------------------
// Route to handle new organization form submission
router.get("/new-organization", requireRole('admin'), showNewOrganizationForm);
router.post(
  "/new-organization",
  organizationValidation,
  requireRole("admin"),
  processNewOrganizationForm,
);
// --------------------------------------------------------------
// Route to handle the edit organization form submission
router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganizationForm,
);
router.post(
  "/edit-organization/:id",
  organizationValidation,
  requireRole("admin"),
  processEditOrganizationForm,
);
// --------------------------------------------------------------
// Route to handle new project form submission
router.get("/new-project", requireRole("admin"), showNewProjectForm);
router.post(
  "/new-project",
  projectValidation,
  requireRole("admin"),
  processNewProjectForm,
);
// --------------------------------------------------------------
// Routes to handle the update (edit) project form
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);
router.post(
  "/edit-project/:id",
  projectValidation,
  requireRole("admin"),
  processEditProjectForm,
);
// --------------------------------------------------------------
// Routes to handle the new category form
router.get("/new-category", requireRole("admin"), showNewCategoryForm);
router.post(
  "/new-category",
  categoryValidation,
  requireRole("admin"),
  processNewCategoryForm,
);
// --------------------------------------------------------------
// Routes to handle the update (edit) category form
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);
router.post(
  "/edit-category/:id",
  categoryValidation,
  requireRole("admin"),
  processEditCategoryForm,
);
// --------------------------------------------------------------
// Routes to handle the assign categories to project form
router.get(
  "/assign-categories/:projectId",
  requireRole("admin"),
  showAssignCategoriesForm,
);
router.post(
  "/assign-categories/:projectId",
  requireRole("admin"),
  processAssignCategoriesForm,
);

// ========================================================================

// User registration routes
router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);
// User login/out routes
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);
// Dashboard with middleware checking
router.get("/dashboard", requireLogin, showDashboard);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
