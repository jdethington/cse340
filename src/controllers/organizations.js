// Import any needed model functions
import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";
import { body, validationResult } from "express-validator";

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required")
    .isLength({ max: 500 })
    .withMessage("Organization description cannot exceed 500 characters"),
  body("contactEmail")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
];

// Define any controller functions

// /organizations
const showOrganizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  // console.log('Organizations:', organizations);
  const title = "Our Partner Organizations";

  res.render("organizations", { title, organizations });
};

// /organization/[id]
const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;
  // Could this be reduced to 1 parameter?
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = "Organization Details";

  res.render("organization", { title, organizationDetails, projects });
};

// /new-organization
const showNewOrganizationForm = async (req, res) => {
  const title = "Add New Organization";

  res.render("new-organization", { title });
};

//
const processNewOrganizationForm = async (req, res) => {
  //Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    // Redirect back to  the new organization form
    return res.redirect('/new-organization');
  }
  const { name, description, contactEmail } = req.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(
    name,
    description,
    contactEmail,
    logoFilename,
  );
  req.flash("success", "Organization added successfully!");
  res.redirect(`/organization/${organizationId}`);
};

// Export any controller functions
export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
};
