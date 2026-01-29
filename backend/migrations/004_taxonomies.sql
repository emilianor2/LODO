-- Create taxonomies table
CREATE TABLE IF NOT EXISTS taxonomies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(64) NOT NULL,
    value VARCHAR(128) NOT NULL,
    label VARCHAR(128) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_category_value (category, value),
    INDEX idx_category_active (category, is_active, sort_order)
);

-- Seed initial data V1
INSERT IGNORE INTO taxonomies (category, value, label, sort_order) VALUES
-- Organization Type
('organizationType', 'Startup', 'Startup', 10),
('organizationType', 'Investor', 'Investor', 20),
('organizationType', 'Hub', 'Hub', 30),
('organizationType', 'Accelerator', 'Accelerator', 40),
('organizationType', 'Corporate', 'Corporate', 50),
('organizationType', 'University', 'University', 60),
('organizationType', 'Government', 'Government', 70),
('organizationType', 'NGO', 'NGO', 80),
('organizationType', 'Research Center', 'Research Center', 90),
('organizationType', 'Service Provider', 'Service Provider', 100),
('organizationType', 'Other', 'Other', 110),

-- Sector Primary
('sectorPrimary', 'AgTech', 'AgTech', 10),
('sectorPrimary', 'FoodTech', 'FoodTech', 20),
('sectorPrimary', 'ClimateTech', 'ClimateTech', 30),
('sectorPrimary', 'BioTech', 'BioTech', 40),
('sectorPrimary', 'WaterTech', 'WaterTech', 50),
('sectorPrimary', 'EnergyTech', 'EnergyTech', 60),
('sectorPrimary', 'SupplyChain/Logistics', 'SupplyChain/Logistics', 70),
('sectorPrimary', 'FinTech', 'FinTech', 80),
('sectorPrimary', 'IoT/Hardware', 'IoT/Hardware', 90),
('sectorPrimary', 'CircularEconomy', 'CircularEconomy', 100),
('sectorPrimary', 'Other', 'Other', 110),

-- Stage
('stage', 'Pre-seed', 'Pre-seed', 10),
('stage', 'Seed', 'Seed', 20),
('stage', 'Series A', 'Series A', 30),
('stage', 'Series B+', 'Series B+', 40),
('stage', 'Growth', 'Growth', 50),
('stage', 'Scale', 'Scale', 60),
('stage', 'Unknown', 'Unknown', 70),

-- Outcome Status
('outcomeStatus', 'Active', 'Active', 10),
('outcomeStatus', 'Acquired', 'Acquired', 20),
('outcomeStatus', 'Closed', 'Closed', 30),
('outcomeStatus', 'Merged', 'Merged', 40),
('outcomeStatus', 'Stealth', 'Stealth', 50),
('outcomeStatus', 'Unknown', 'Unknown', 60),

-- Technology
('technology', 'AI/ML', 'AI/ML', 10),
('technology', 'IoT', 'IoT', 20),
('technology', 'Blockchain', 'Blockchain', 30),
('technology', 'Robotics', 'Robotics', 40),
('technology', 'Drones', 'Drones', 50),
('technology', 'SaaS', 'SaaS', 60),
('technology', 'Sensors', 'Sensors', 70),
('technology', 'Satellite/Remote Sensing', 'Satellite/Remote Sensing', 80),
('technology', 'Analytics', 'Analytics', 90),
('technology', 'Automation', 'Automation', 100),
('technology', 'Biotech', 'Biotech', 110),
('technology', 'Other', 'Other', 120),

-- Impact Area
('impactArea', 'Carbon', 'Carbon', 10),
('impactArea', 'Water', 'Water', 20),
('impactArea', 'Soil', 'Soil', 30),
('impactArea', 'Biodiversity', 'Biodiversity', 40),
('impactArea', 'Waste', 'Waste', 50),
('impactArea', 'FoodSecurity', 'FoodSecurity', 60),
('impactArea', 'EnergyEfficiency', 'EnergyEfficiency', 70),
('impactArea', 'Traceability', 'Traceability', 80),
('impactArea', 'Inclusion', 'Inclusion', 90),
('impactArea', 'Other', 'Other', 100),

-- Badge
('badge', 'Verified', 'Verified', 10),
('badge', 'Featured', 'Featured', 20),
('badge', 'Partner', 'Partner', 30),
('badge', 'TopStartup', 'TopStartup', 40),
('badge', 'HighImpact', 'HighImpact', 50);

-- Sector Secondary (Reuse Primary values if needed, or we can just let it reference the same list logic in code)
-- For now, we won't strictly seed unique values for sectorSecondary if it matches Primary, 
-- but the backend validation can check against sectorPrimary list or we can duplicate.
-- The prompt says: "(mismo set que sectorPrimary o subset)".
-- We will assume the backend validation uses the 'sectorPrimary' category for valid values, 
-- OR we can duplicate them with category 'sectorSecondary'. 
-- Let's duplicate to be safe and explicit, as the prompt lists it as a category.

INSERT IGNORE INTO taxonomies (category, value, label, sort_order)
SELECT 'sectorSecondary', value, label, sort_order FROM taxonomies WHERE category = 'sectorPrimary';
