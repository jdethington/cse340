 
import db from './db.js'
 
const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            TO_CHAR(p.project_date, 'Month DD, YYYY') AS date_long,
            TO_CHAR(p.project_date, 'MM-DD-YYYY') AS date_short,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        INNER JOIN public.organization o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ;
    `;
 
    const result = await db.query(query);
    return result.rows;
}
 
export { getAllProjects }
 