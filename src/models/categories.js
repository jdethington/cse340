import db from "./db.js";

const getAllCategories = async () => {
  const query = `
    SELECT
      category_id AS id,
      name,
      description
    FROM category;
  `;
  const result = await db.query(query);
  return result.rows;
};

// Retrieve a single category by its ID.
const getCategory = async (categoryId) => {
  const query = `
    SELECT
      category_id,
      name,
      description
    FROM category
    WHERE category_id = $1;
  `;
  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);
  // return result.rows;
  return result.rows.length > 0 ? result.rows[0] : null;
};

// Retrieve all categories for a given service project.
const getAllCategoriesForServiceProject = async (projectId) => {
  const query = `
    SELECT
      c.category_id,
      name,
      description
    FROM category c
    JOIN project_category pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;
  `;
  const queryParams = [projectId];
  const result = await db.query(query, queryParams);
  return result.rows;
  // return result.rows.length > 0 ? result.rows[0] : null;
};

// Retrieve all service projects for a given category.
const getAllServiceProjectsForCategory = async (categoryId) => {
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
    FROM project p
    JOIN project_category pc ON p.project_id = pc.project_id
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date ASC;
  `;
  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);
  return result.rows;
  // return result.rows.length > 0 ? result.rows[0] : null;
};

export {
  getAllCategories,
  getCategory,
  getAllCategoriesForServiceProject,
  getAllServiceProjectsForCategory,
};
