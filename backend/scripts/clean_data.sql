-- Script de limpieza para normalizar datos existentes en la tabla organizations
-- Basado en las reglas de TRIM y conversión de espacios a NULL

UPDATE organizations SET
    name = TRIM(name),
    organization_type = TRIM(organization_type),
    sector_primary = TRIM(sector_primary),
    outcome_status = TRIM(outcome_status),
    country = TRIM(country),
    region = TRIM(region),
    city = TRIM(city),
    -- Opcionales: si quedan vacíos tras TRIM, pasar a NULL
    sector_secondary = CASE WHEN TRIM(sector_secondary) = '' THEN NULL ELSE TRIM(sector_secondary) END,
    stage = CASE WHEN TRIM(stage) = '' THEN NULL ELSE TRIM(stage) END,
    website = CASE WHEN TRIM(website) = '' THEN NULL ELSE TRIM(website) END,
    notes = CASE WHEN TRIM(notes) = '' THEN NULL ELSE TRIM(notes) END;

-- Verificación de nulos en coordenadas (opcional, para detectar inconsistencias)
-- SELECT id, name FROM organizations WHERE (lat IS NOT NULL AND lng IS NULL) OR (lat IS NULL AND lng IS NOT NULL);
