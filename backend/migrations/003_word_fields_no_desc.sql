-- Migración: Solo agregar las columnas nuevas (asumiendo que description ya existe)
-- Si alguna columna ya existe, comenta esa línea antes de ejecutar

ALTER TABLE organizations
    ADD COLUMN year_founded INT NULL,
    ADD COLUMN logo_url VARCHAR(512) NULL,
    ADD COLUMN linkedin_url VARCHAR(512) NULL,
    ADD COLUMN contact_email VARCHAR(255) NULL,
    ADD COLUMN contact_phone VARCHAR(50) NULL,
    ADD COLUMN instagram_url VARCHAR(512) NULL,
    ADD COLUMN tags_json TEXT NULL,
    ADD COLUMN technology_json TEXT NULL,
    ADD COLUMN impact_area_json TEXT NULL,
    ADD COLUMN badge_json TEXT NULL;

-- Inicializar description si existe pero está NULL
UPDATE organizations SET description = '' WHERE description IS NULL;
