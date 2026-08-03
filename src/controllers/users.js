import bcrypt from "bcrypt";
import {
  createUser,
  authenticateUser,
  getAllUsers,
  addUserToProject,
  removeUserFromProject,
  getUserIsVolunteeringForProject,
} from "../models/users.js";
import flash from "../middleware/flash.js";
import { getAllProjectsForUser } from "../models/projects.js";

const showUserRegistrationForm = async (req, res) => {
  res.render("register", { title: "Register" });
};

const processUserRegistrationForm = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user in the database
    const userId = await createUser(name, email, passwordHash);

    // Redirect to the home page after successful registration
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/");
  } catch (error) {
    console.log("Error registering user: ", error);
    req.flash(
      "error",
      "An error occurred during registration. Please try again.",
    );
    res.redirect("/register");
  }
};

const showLoginForm = async (req, res) => {
  res.render("login", { title: "Login" });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    if (user) {
      // Store user info in session
      req.session.user = user;
      req.flash("success", `Login successful! Welcome ${user.name}.`);

      if (res.locals.NODE_ENV === "development") {
        console.log("User logged in:", user);
      }

      res.redirect("/dashboard");
    } else {
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/login");
  }
};

const processLogout = async (req, res) => {
  if (req.session.user) {
    delete req.session.user;
  }

  req.flash("success", "Logout successful!");
  res.redirect("/login");
};

const requireLogin = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to access that page.");
    return res.redirect("/login");
  }
  next();
};

const showDashboard = async (req, res) => {
  const user = req.session.user;

  const projects = await getAllProjectsForUser(user.user_id);
  if (res.locals.NODE_ENV === "development") {
    console.log("User logged in:", user);
    console.log("User projects:", projects);
  }
  res.render("dashboard", {
    title: "Dashboard",
    name: user.name,
    email: user.email,
    projects,
  });
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
  return (req, res, next) => {
    // Check if user is logged in first
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }

    // Check if user's role matches the required role
    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/dashboard");
    }

    // User has required role, continue
    next();
  };
};

const showUsers = async (req, res) => {
  const users = await getAllUsers();
  const title = "Registered Users";

  res.render("users", { title, users });
};

// Add Volunteer to Project
const addVolunteerToProject = async (req, res) => {
  const projectId = req.params.id;
  const user = req.session.user;

  if (!projectId || !user) {
    req.flash("error", "Unable to process your request. Please try again.");
    return res.redirect("/projects");
  }

  const userId = user.user_id;
  if (process.env.NODE_ENV === "development") {
    console.log("addVolunteerToProject projectId:", projectId);
    console.log("addVolunteerToProject user:", user);
  }

  const isVolunteer = await getUserIsVolunteeringForProject(userId, projectId);
  if (isVolunteer) {
    req.flash("error", "You have already volunteered for this project.");
    return res.redirect(`/project/${projectId}`);
  }
  if (process.env.NODE_ENV === "development") {
    console.log("isVolunteer:", isVolunteer);
  }

  const response = await addUserToProject(projectId, userId);
  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("addVolunteerToProject", response);
  }

  if (!response) {
    req.flash(
      "error",
      "Unable to volunteer for this project. Please try again.",
    );
    return res.redirect(`/project/${projectId}`);
  }

  req.flash("success", "You have volunteered for project.");
  res.redirect(`/project/${projectId}`);
};
// //////////////////////////////////////////////////////////////////////
const removeVolunteerFromProject = async (req, res) => {
  const projectId = req.params.id;
  const user = req.session.user;
  const userId = user.user_id;
  if (process.env.NODE_ENV === "development") {
    console.log("removeVolunteerFromProject projectId:", projectId);
    console.log("removeVolunteerFromProject user:", user);
  }

  if (!projectId || !user) {
    req.flash("error", "Unable to process your request. Please try again.");
    return res.redirect("/projects");
  }

  const isVolunteer = await getUserIsVolunteeringForProject(userId, projectId);
  if (!isVolunteer) {
    req.flash(
      "error",
      "Unable to remove. You are not volunteered for this project.",
    );
    return res.redirect(`/project/${projectId}`);
  }
  if (process.env.NODE_ENV === "development") {
    console.log("isVolunteer:", isVolunteer);
  }

  const response = await removeUserFromProject(projectId, userId);
  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("removeVolunteerFromProject", response);
  }

  if (!response) {
    req.flash(
      "error",
      "Unable to remove volunteer from this project. Please try again.",
    );
    return res.redirect(`/project/${projectId}`);
  }
  req.flash("success", "You are no longer a volunteer for this project.");
  res.redirect(`/project/${projectId}`);
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
  requireRole,
  showUsers,
  addVolunteerToProject,
  removeVolunteerFromProject,
};
