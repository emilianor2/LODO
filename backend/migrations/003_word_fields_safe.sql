-- Migración segura: Solo agrega columnas si no existen
-- Verifica primero qué columnas ya tienes con: DESCRIBE organizations;

-- Agregar columnas solo si no existen (MariaDB 10.0.2+)
ALTER TABLE organizations
    ADD COLUMN IF NOT EXISTS description TEXT NULL,
    ADD COLUMN IF NOT EXISTS year_founded INT NULL,
    ADD COLUMN IF NOT EXISTS logo_url VARCHAR(512) NULL,
    ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(512) NULL,
    ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50) NULL,
    ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(512) NULL,
    ADD COLUMN IF NOT EXISTS tags_json TEXT NULL,
    ADD COLUMN IF NOT EXISTS technology_json TEXT NULL,
    ADD COLUMN IF NOT EXISTS impact_area_json TEXT NULL,
    ADD COLUMN IF NOT EXISTS badge_json TEXT NULL;

-- Inicializar description con valor por defecto para registros existentes
UPDATE organizations SET description = '' WHERE description IS NULL;

-- Nota: description se valida en el código (no puede ser NULL al crear, debe tener 20+ chars para publicar)
