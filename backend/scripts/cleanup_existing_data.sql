-- Script opcional: Limpiar y normalizar datos existentes después de aplicar la migración

-- 1. Asegurar que description no esté vacío (poner placeholder si es necesario)
UPDATE organizations 
SET description = 'Descripción pendiente de completar' 
WHERE description = '' OR description IS NULL;

-- 2. Normalizar strings (TRIM)
UPDATE organizations SET
    name = TRIM(name),
    organization_type = TRIM(organization_type),
    sector_primary = TRIM(sector_primary),
    outcome_status = TRIM(outcome_status),
    country = TRIM(country),
    region = TRIM(region),
    city = TRIM(city),
    description = TRIM(description);

-- 3. Convertir strings vacíos a NULL en campos opcionales
UPDATE organizations SET
    sector_secondary = CASE WHEN TRIM(COALESCE(sector_secondary, '')) = '' THEN NULL ELSE TRIM(sector_secondary) END,
    stage = CASE WHEN TRIM(COALESCE(stage, '')) = '' THEN NULL ELSE TRIM(stage) END,
    website = CASE WHEN TRIM(COALESCE(website, '')) = '' THEN NULL ELSE TRIM(website) END,
    notes = CASE WHEN TRIM(COALESCE(notes, '')) = '' THEN NULL ELSE TRIM(notes) END,
    logo_url = CASE WHEN TRIM(COALESCE(logo_url, '')) = '' THEN NULL ELSE TRIM(logo_url) END,
    linkedin_url = CASE WHEN TRIM(COALESCE(linkedin_url, '')) = '' THEN NULL ELSE TRIM(linkedin_url) END,
    contact_email = CASE WHEN TRIM(COALESCE(contact_email, '')) = '' THEN NULL ELSE TRIM(contact_email) END,
    contact_phone = CASE WHEN TRIM(COALESCE(contact_phone, '')) = '' THEN NULL ELSE TRIM(contact_phone) END,
    instagram_url = CASE WHEN TRIM(COALESCE(instagram_url, '')) = '' THEN NULL ELSE TRIM(instagram_url) END;

-- 4. Verificar inconsistencias de coordenadas
SELECT id, name, lat, lng 
FROM organizations 
WHERE (lat IS NOT NULL AND lng IS NULL) OR (lat IS NULL AND lng IS NOT NULL);

-- Si hay resultados, decidir: poner ambas en NULL o completar manualmente
-- UPDATE organizations SET lat = NULL, lng = NULL WHERE (lat IS NOT NULL AND lng IS NULL) OR (lat IS NULL AND lng IS NOT NULL);

-- 5. Verificar organizaciones PUBLISHED que no cumplen el checklist
SELECT id, name, status, 
       LENGTH(description) as desc_len,
       website,
       linkedin_url,
       organization_type,
       stage
FROM organizations 
WHERE status = 'PUBLISHED'
  AND (
      LENGTH(description) < 20 
      OR (website IS NULL AND linkedin_url IS NULL)
      OR (organization_type = 'Startup' AND (stage IS NULL OR stage = ''))
  );

-- Estas organizaciones deberían volver a IN_REVIEW o DRAFT para corrección
-- UPDATE organizations SET status = 'IN_REVIEW' WHERE id IN (...);
