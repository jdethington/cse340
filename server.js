import express from 'express';
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const ENABLE_SQL_LOGGING = process.env.ENABLE_SQL_LOGGING?.toLowerCase() === 'true';

// Define the port number the server will lister on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Configure Express middleware
 */

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});
// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
})

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    // console.log('Organizations:', organizations);
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
})

app.get('/projects', async (req, res) => {
    const projects = await getAllProjects();
    // console.log('Projects:', projects);
    const title = 'Service Projects';
    res.render('projects', { title, projects });
});

app.get('/categories', async (req, res) => {
    const categories = await getAllCategories();
    // console.log('Categories:', categories);
    const title = 'Categories';
    res.render('categories', { title, categories });
});


// app.get('/', (req, res) => {
//     res.send('Hello from Express (using nodemon)!');
// });

// app.listen(PORT, () => {
//     console.log(`Server is running at http://127.0.0.1:${PORT}`)
//     console.log(`Environment: ${NODE_ENV}`);
// })

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}   SQL Logging: ${ENABLE_SQL_LOGGING}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});