-- ====================
-- Organization Table
-- ====================
-- CREATE TABLE organization (
-- 	organization_id SERIAL PRIMARY KEY,
-- 	name VARCHAR(150) NOT NULL,
-- 	description TEXT NOT NULL,
-- 	contact_email VARCHAR(255) NOT NULL,
-- 	logo_filename VARCHAR(255) NOT NULL
-- );

-- ========================================
-- Insert sample data: Organizations
-- ========================================
-- INSERT INTO organization (name, description, contact_email, logo_filename)
-- VALUES
-- 	('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
-- 	('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
-- 	('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');




-- =====================================================
-- Clean Slate: Drop all tables if they exist
-- =====================================================
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS project_category CASCADE;
 
-- =====================================================
-- 1. CREATE TABLES & CONSTRAINTS
-- =====================================================
 
-- Table: organization
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    logo_filename VARCHAR(100) NULL
);
 
-- Table: project
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    location VARCHAR(225) NOT NULL,
    project_date DATE NOT NULL,
    organization_id INT NOT NULL,
    CONSTRAINT fk_service_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
 
 
 -- Table: category
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Junction table: project_category (Many-to-Many)
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id) 
        REFERENCES project (project_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id) 
        REFERENCES category (category_id) 
        ON DELETE CASCADE
);

-- Create index for foreign key performance
CREATE INDEX fk_service_project_organization_idx ON project (organization_id ASC);

-- Performance indexes
CREATE INDEX idx_project_category_project ON project_category (project_id);
CREATE INDEX idx_project_category_category ON project_category (category_id);

-- =====================================================
-- 2. SEED DATA INSERTIONS
-- =====================================================
 
-- Insert Organizations
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction project.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);
 
-- Insert 5 Projects per Organization (15 total)
INSERT INTO project (title, description, location, project_date, organization_id) VALUES
-- BrightFuture Builders (organization_id: 1)
('Community Center Renovation', 'Rebuilding the main hall and installing eco-friendly insulation.', '123 Main St', '2026-08-15', 1),
('Sustainable Playground Build', 'Constructing a neighborhood playground using entirely recycled plastics and wood.', 'Corner of 5th and Oak', '2026-09-22', 1),
('Tiny Homes Infrastructure Assembly', 'Framing and weatherproofing a cluster of transitional tiny homes for the unhoused.', '884 Transit Way', '2026-10-05', 1),
('Solar Panel Installation Drive', 'Outfitting a local community shelter with energy-efficient solar panels.', '710 Sunshine Rd', '2026-11-12', 1),
('Wheelchair Ramp Access Build', 'Building wooden accessibility ramps for elderly residents in low-income neighborhoods.', '415 Maple Ave', '2026-12-01', 1),
 
-- GreenHarvest Growers (organization_id: 2)
('Downtown Urban Garden Setup', 'Building and planting community vegetable raised beds.', '456 Elm St', '2026-09-01', 2),
('Composting Systems Workshop', 'Building large-scale neighborhood composting bins and teaching basic waste diversion.', 'Community Greenhouse, 2nd Sec', '2026-09-15', 2),
('Hydroponic Lab Assembly', 'Setting up vertical hydroponic growing towers inside an inner-city school.', '901 Education Plaza', '2026-10-19', 2),
('Autumn Harvest and Food Prep', 'Gathering seasonal produce and packing nutrition boxes for local food deserts.', '456 Elm St', '2026-11-03', 2),
('Pollinator Highway Planting', 'Sowing native wildflowers across urban green strips to support local bee populations.', 'North Side Highway Median', '2026-11-20', 2),
 
-- UnityServe Volunteers (organization_id: 3)
('Homeless Shelter Food Drive', 'Sorting, packing, and distributing non-perishable food donations.', '789 Oak St', '2026-07-20', 3),
('Senior Center Tech Literacy Day', 'One-on-one coaching helping elderly community members learn to use video chat and email.', 'Golden Years Care Facility', '2026-08-29', 3),
('Youth Sports Equipment Sorting', 'Cleaning, cataloging, and organizing donated sports gear for after-school programs.', 'Unity Gym Warehouse', '2026-10-10', 3),
('Community Winter Coat Distribution', 'An outdoor handout event providing winter apparel and blankets to families in need.', 'St. Jude Plaza Parking Lot', '2026-11-15', 3),
('Holiday Toy Drive Wrap-up', 'Wrapping and organizing holiday gifts for foster youth and low-income families.', '789 Oak St', '2026-12-18', 3);
 


-- =====================================================
-- 3. ADD CATEGORIES & ASSOCIATIONS
-- =====================================================

-- Insert relevant service project categories
INSERT INTO category (name, description) VALUES
('Community Infrastructure', 'Construction, renovation, and accessibility projects'),
('Environmental Sustainability', 'Gardening, planting, composting, and eco-friendly initiatives'),
('Food Security', 'Food drives, harvesting, and nutrition support'),
('Education & Youth', 'Tutoring, workshops, and youth development programs'),
('Health & Wellness', 'Senior support, accessibility, and community care'),
('Disaster & Emergency Relief', 'Shelter support and immediate aid distribution')
ON CONFLICT (name) DO NOTHING;

-- Associate projects with categories (each project gets at least one)
INSERT INTO project_category (project_id, category_id)
SELECT 
    p.project_id,
    c.category_id
FROM project p
CROSS JOIN category c
WHERE 
    -- BrightFuture projects (infrastructure)
    (p.organization_id = 1 AND c.name IN ('Community Infrastructure', 'Health & Wellness'))
    OR
    -- GreenHarvest projects (environment + food)
    (p.organization_id = 2 AND c.name IN ('Environmental Sustainability', 'Food Security', 'Education & Youth'))
    OR
    -- UnityServe projects (direct service)
    (p.organization_id = 3 AND c.name IN ('Food Security', 'Education & Youth', 'Health & Wellness', 'Disaster & Emergency Relief'))
ON CONFLICT DO NOTHING;
