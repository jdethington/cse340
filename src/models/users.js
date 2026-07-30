import db from "./db.js";
import bcrypt from "bcrypt";

const createUser = async (name, email, passwordHash) => {
  const default_role = "user";
  const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id;
    `;
  const queryParams = [name, email, passwordHash, default_role];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create user");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new user with ID: ", result.rows[0].user_id);
  }
  return result.rows[0].user_id;
};

const getAllUsers = async () => {
  const query = `
    SELECT u.user_id AS id, u.name AS name, u.email AS email, r.role_name AS role 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    `;
  const result = await db.query(query);

  if (result.rows.length === 0) {
    return null; // User not found
  }

  return result.rows;
};

// Login information
const findUserByEmail = async (email) => {
  const query = `
    SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
    `;

  const queryParams = [email];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    return null; // User not found
  }

  return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }
  console.log(user);
  const result = await verifyPassword(password, user.password_hash);
  if (result) {
    delete user.password_hash;
    console.log(user);

    return user;
  }
  return null;
};

// ==========================================================================
/**
 * Add a user as a volunteer for a project.
 * Idempotent – does nothing if the user is already volunteered.
 * @param {number} projectId
 * @param {number} userId
 * @returns {Array|null>} The volunteer row, or null if already existed
 */
const addUserToProject = async (projectId, userId) => {
  const query = `
    INSERT INTO project_volunteer (project_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (project_id, user_id) DO NOTHING
    RETURNING *;
  `;
  const queryParams = [projectId, userId];
  const results = await db.query(query, queryParams);

  if (results.rows.length === 0)
    throw new Error("Error adding user to project. Try again later.");

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log(
      "Added user: ",
      result.rows[0].user_id,
      " to project: ",
      results.rows[0].project_id,
    );
  }

  return rows[0] || null;
};

/**
 * Remove a user from a project's volunteer list.
 * @param {number} projectId
 * @param {number} userId
 * @returns {Promise<boolean>} true if a row was deleted, false otherwise
 */
const removeUserFromProject = async (projectId, userId) => {
  const query = `
    DELETE FROM project_volunteer
    WHERE project_id = $1
      AND user_id    = $2
    RETURNING *;
  `;
  const queryParams = [projectId, userId];

  const results = await db.query(query, queryParams);
  return results.rows || null;
};

/**
 * Retrieve all projects a user has volunteered for,
 * ordered by most recent volunteer action first.
 * @param {number} userId
 * @returns {Promise<object[]>} Array of project + volunteered_at rows
 */
const getProjectsForUser = async (userId) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id,
      pv.volunteered_at
    FROM project_volunteer pv
    JOIN project p ON p.project_id = pv.project_id
    WHERE pv.user_id = $1
    ORDER BY pv.volunteered_at DESC;
  `;
  const queryParams = [userId];

  const results = await db.query(query, queryParams);
  return results;
};

// ==========================================================================

export {
  createUser,
  authenticateUser,
  getAllUsers,
  addUserToProject,
  removeUserFromProject,
  getProjectsForUser,
};
