// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails } from "../models/organizations.js";
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define any controller functions

// /organizations
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    // console.log('Organizations:', organizations);
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

// /organization/[id]
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    // Could this be reduced to 1 parameter?
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};

// Export any controller functions
export { showOrganizationsPage, showOrganizationDetailsPage }