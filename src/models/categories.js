import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT
            category_id AS id,
            name,
            description
        FROM public.category;
    `;
    const result = await db.query(query);
    return result.rows;
};

export { getAllCategories };