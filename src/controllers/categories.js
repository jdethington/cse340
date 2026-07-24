// Import any needed model functions
import {
  getAllCategories,
  getCategory,
  // getAllCategoriesForServiceProject,
  getCategoriesByServiceProjectId,
  getAllServiceProjectsForCategory,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectDetails } from "../models/projects.js";

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

const showAssignCategoriesForm = async (req, res) => {
  const projectId = await req.params.projectId;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByServiceProjectId(projectId);

  const title = "Assign Categories to Project";
  console.log(
    `${title}: `,
    // "projectDetails ",
    // projectDetails,
    // categories,
    assignedCategories,
  );
  res.render("assign-categories", {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];
  console.log(selectedCategoryIds);

  // Ensure selectedCategories is an array
  const categoryIdsArray = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];
  console.log(selectedCategoryIds);

  await updateCategoryAssignments(projectId, categoryIdsArray);
  req.flash("success", "Category updated successfully.");
  res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
  showCategoriesPage,
  showCategoryPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
