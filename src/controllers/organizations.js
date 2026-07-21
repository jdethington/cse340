// Import any needed model functions
import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

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
  const { name, description, contactEmail } = req.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(
    name,
    description,
    contactEmail,
    logoFilename,
  );
  res.redirect(`/organization/${organizationId}`);
};

// Export any controller functions
export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
};
