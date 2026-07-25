import db from "./db.js";

const getAllProjects = async () => {
  const query = `
    SELECT
      project_id,
      title,
      p.description,
      location,
      TO_CHAR(project_date, 'Month DD, YYYY') AS date_long,
      TO_CHAR(project_date, 'MM-DD-YYYY') AS date_short,
      p.organization_id,
      name AS organization_name
    FROM project p
    JOIN organization o ON p.organization_id = o.organization_id
    ORDER BY project_date ASC;
  `;

  const result = await db.query(query);
  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      location,
      TO_CHAR(project_date, 'Month DD, YYYY') AS date_long,
      TO_CHAR(project_date, 'MM-DD-YYYY') AS date_short
    FROM project
    WHERE organization_id = $1
    ORDER BY project_date ASC;
  `;
  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      TO_CHAR(p.project_date, 'Month DD, YYYY') AS date_long,
      TO_CHAR(p.project_date, 'MM-DD-YYYY') AS date_short,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM project p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE project_date >= CURRENT_DATE
    ORDER BY p.project_date ASC
    LIMIT $1
  `;

  const queryParams = [number_of_projects];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectDetails = async (id) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      TO_CHAR(p.project_date, 'Month DD, YYYY') AS date_long,
      TO_CHAR(p.project_date, 'MM-DD-YYYY') AS date_short,
      p.project_date AS date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM project p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1
  `;

  const queryParams = [id];
  const result = await db.query(query, queryParams);

  // Return the first row of the result set, or null if no rows are found
  return result.rows.length > 0 ? result.rows[0] : null;
};

const createProject = async (
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
    INSERT INTO project (title, description, location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const queryParams = [title, description, location, date, organizationId];
  const results = await db.query(query, queryParams);

  if (results.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID: ", results.rows[0].project_id);
  }

  return results.rows[0].project_id;
};

const updateProject = async (
  projectId,
  title,
  description,
  location,
  projectDate,
  organizationId,
) => {
  const query = `
    UPDATE project
    SET title = $1,
      description = $2,
      location = $3,
      project_date = $4,
      organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const queryParams = [
    title,
    description,
    location,
    projectDate,
    organizationId,
    projectId,
  ];

  const results = await db.query(query, queryParams);

  if (results.rows.length === 0) {
    throw new Error("Project not found or Update failed");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated project with ID: ", projectId);
  }

  return results.rows[0].organization_id;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject,
};
