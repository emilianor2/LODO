-- Migración: Agregar campos alineados al documento de requerimientos
-- Almacenamiento v1: Campos multi-selección como JSON TEXT

ALTER TABLE organizations
    ADD COLUMN description TEXT NULL,
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

-- Inicializar description con valor por defecto para registros existentes
UPDATE organizations SET description = '' WHERE description IS NULL;

-- Nota: description se valida en el código (no puede ser NULL al crear, debe tener 20+ chars para publicar)
