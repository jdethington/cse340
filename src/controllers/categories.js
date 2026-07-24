// Import any needed model functions
import { body, validationResult } from "express-validator";
import {
  getAllCategories,
  getCategory,
  // getAllCategoriesForServiceProject,
  getCategoriesByServiceProjectId,
  getAllServiceProjectsForCategory,
  updateCategoryAssignments,
  createCategory,
  updateCategory,
} from "../models/categories.js";
import { getProjectDetails } from "../models/projects.js";

// Define validation and sanitization rules for category form
// Define validation rules for category form
const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Category description is required")
    .isLength({ max: 1000 })
    .withMessage("Category description cannot exceed 1000 characters"),
];

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
  console.log(`${title}: `, assignedCategories);
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
// Create new category
// GET: new-category
const showNewCategoryForm = async (req, res) => {
  const title = "Add New Category";
  res.render("new-category", { title });
};
// POST: new-category
const processNewCategoryForm = async (req, res) => {
  // Check for validity errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // redirect back to the category form
    return res.redirect("/new-category/");
  }
  // Extract form data from the req.body
  const { name, description } = req.body;
  try {
    // Create the new category in the database
    const newCategoryId = await createCategory(name, description);
    console.log("New Category ID: ", newCategoryId);
    req.flash("success", "New Category Created Successfully!");
    res.redirect(`/category/${newCategoryId}`);
  } catch (error) {
    console.error("Error creating new category: ", error);
    req.flash("error", "There was an error creating the new Category.");
    res.redirect("new-category");
  }
};

// Edit Category
// GET: edit-category
const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const category = await getCategory(categoryId);

  const title = "Edit Category";
  // console.log();
  res.render("edit-category", { title, category });
};
// POST: edit-category
const processEditCategoryForm = async (req, res) => {
  // Check for validation
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // Redirect back to the edit category form
    return res.redirect("/edit-category/" + req.params.id);
  }

  const categoryId = req.params.id;
  const { name, description } = req.body;
  console.log(name, description);
  await updateCategory(name, description, categoryId);
  // set success message
  req.flash("success", "Category updated successfully!");
  res.redirect(`/category/${categoryId}`);
};

// Export any controller functions
export {
  showCategoriesPage,
  showCategoryPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
  categoryValidation,
  showEditCategoryForm,
  processEditCategoryForm,
};
