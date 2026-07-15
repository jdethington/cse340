 
import db from './db.js'
 
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
        ORDER BY project_date ;
    `;
 
    const result = await db.query(query);
    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date AS date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};
 
export { getAllProjects, getProjectsByOrganizationId }
 