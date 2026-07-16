// Import any needed model functions
import {
  getAllCategories,
  getCategory,
  getAllCategoriesForServiceProject,
  getAllServiceProjectsForCategory,
} from "../models/categories.js";

// Define any controller functions
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Categories";
  console.log(`${title}: `, categories);
  res.render("categories", { title, categories });
};

const showCategoryPage = async (req, res) => {
  const categoryId = await req.params.id;
  const category = await getCategory(categoryId);
  const projects = await getAllServiceProjectsForCategory(categoryId);
  const title = "Category";
  console.log(`${title}: `, category, projects);
  res.render("category", { title, category, projects });
};

// Export any controller functions
export { showCategoriesPage, showCategoryPage };
