import bcrypt from "bcrypt";
import { createUser } from "../models/users.js";

const showUserRegistrationForm = (req, res) => {
  res.render("register", { title: "Register" });
};

const processUserRegistrationForm = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user in the database
    const userId = await createUser(name, email, passwordHash);

    // Redirect to the home page after successful registration
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/");
  } catch (error) {
    console.log("Error registering user: ", error);
    req.flash(
      "error",
      "An error occurred during registration. Please try again.",
    );
    res.redirect("/register");
  }
};

export { showUserRegistrationForm, processUserRegistrationForm };
