# Migración Word Fields - Guía de Implementación

## Resumen de Cambios

Esta migración alinea el modelo de datos con el documento de requerimientos (Word), agregando:
- **Campos descriptivos**: description, year_founded, logo_url, linkedin_url, contact_email, contact_phone, instagram_url
- **Multi-selección (JSON)**: tags, technology, impact_area, badge
- **Validaciones estrictas** para publicación
- **Lifecycle management** con transiciones controladas

---

## 1. Aplicar Migración SQL

### PowerShell (Windows):
```powershell
Get-Content backend\migrations\003_word_fields.sql | mysql.exe -u root -p lodo_db
```

### CMD:
```cmd
mysql.exe -u root -p lodo_db < backend\migrations\003_word_fields.sql
```

Esto agregará las nuevas columnas a la tabla `organizations` sin romper datos existentes.

---

## 2. Archivos Modificados/Creados

### Nuevos Archivos:
- **`migrations/003_word_fields.sql`**: Migración de base de datos
- **`internal/organizations/json_fields.go`**: Helpers para serializar/deserializar arrays a JSON
- **`internal/organizations/normalize.go`**: Normalización y validación de datos (actualizado con ValidateForPublish)

### Archivos Actualizados:
- **`internal/organizations/entity.go`**: Agregados 11 campos nuevos
- **`internal/organizations/repository.go`**: Actualizado Create y todos los Selects para incluir nuevos campos
- **`internal/organizations/service.go`**: Lifecycle estricto + checklist de publicación
- **`internal/organizations/handler.go`**: Mejores códigos de error HTTP (400, 404, 422)

---

## 3. Reglas de Negocio Implementadas

### A) Normalización (automática en Create):
- TRIM en todos los strings obligatorios
- Campos opcionales vacíos → NULL en DB
- Validación de coordenadas (lat/lng deben ir juntos)

### B) Lifecycle (transiciones válidas):
```
DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED
        ↑            ↓
        └────────────┘ (permitido volver a DRAFT desde IN_REVIEW)
```

**NO permitido**: DRAFT → PUBLISHED directo

### C) Checklist de Publicación:
Para que una organización pase de `IN_REVIEW` a `PUBLISHED`, debe cumplir:
1. **Description**: Mínimo 20 caracteres
2. **Contacto**: Al menos Website O LinkedIn URL
3. **Campos básicos**: name, organizationType, sectorPrimary, outcomeStatus, country, region, city
4. **Regla especial**: Si organizationType == "Startup" → stage es OBLIGATORIO

Si falla alguna validación, el endpoint `/organizations/{id}/publish` devuelve **422 Unprocessable Entity** con mensaje claro.

---

## 4. Cómo Probar

### A) Crear una organización DRAFT (con nuevos campos):

```bash
POST http://localhost:8080/organizations
Authorization: Bearer secret123
Content-Type: application/json

{
  "id": "startup-test-001",
  "name": "TechCorp",
  "organizationType": "Startup",
  "sectorPrimary": "Technology",
  "stage": "Seed",
  "outcomeStatus": "Active",
  "country": "Argentina",
  "region": "Buenos Aires",
  "city": "CABA",
  "description": "Una startup innovadora enfocada en IA y machine learning para el sector agrícola",
  "yearFounded": 2023,
  "website": "https://techcorp.example.com",
  "linkedinUrl": "https://linkedin.com/company/techcorp",
  "contactEmail": "info@techcorp.example.com",
  "tags": ["AI", "AgTech", "B2B"],
  "technology": ["Python", "TensorFlow", "AWS"],
  "impactArea": ["Agriculture", "Sustainability"],
  "badge": ["Certified B Corp"]
}
```

**Respuesta esperada**: 201 Created con la org en estado `DRAFT`

---

### B) Enviar a revisión:

```bash
POST http://localhost:8080/organizations/startup-test-001/review
Authorization: Bearer secret123
```

**Respuesta esperada**: 200 OK (estado cambia a `IN_REVIEW`)

---

### C) Publicar (debe pasar validaciones):

```bash
POST http://localhost:8080/organizations/startup-test-001/publish
Authorization: Bearer secret123
```

**Respuesta esperada**: 200 OK (estado cambia a `PUBLISHED`)

---

### D) Verificar en endpoint público:

```bash
GET http://localhost:8080/public/organizations
```

Deberías ver la organización con todos los campos nuevos incluidos.

---

### E) Probar caso de error (sin description):

```bash
POST http://localhost:8080/organizations
Authorization: Bearer secret123
Content-Type: application/json

{
  "id": "fail-test",
  "name": "Test",
  "organizationType": "Startup",
  "sectorPrimary": "Tech",
  "outcomeStatus": "Active",
  "country": "Argentina",
  "region": "BA",
  "city": "CABA",
  "description": "Corto"
}
```

Luego intenta publicar:
```bash
POST /organizations/fail-test/review
POST /organizations/fail-test/publish
```

**Respuesta esperada**: 422 con mensaje "description is too short (min 20 chars required for publishing)"

---

### F) Probar caso sin Website ni LinkedIn:

Crea una org sin `website` ni `linkedinUrl`, envíala a review e intenta publicar.

**Respuesta esperada**: 422 con mensaje "at least one contact link (Website or LinkedIn) is required to publish"

---

## 5. Estructura de Datos JSON en DB

Los campos multi-selección se guardan como JSON TEXT:

**Ejemplo en DB**:
```
tags_json: ["AI", "AgTech", "B2B"]
technology_json: ["Python", "TensorFlow", "AWS"]
```

Si el array está vacío o es null, se guarda como `NULL` en la DB.

---

## 6. Compatibilidad con Datos Existentes

- Las columnas nuevas permiten `NULL` (excepto `description` que tiene DEFAULT '')
- Los registros existentes NO se rompen
- Al hacer SELECT, los campos JSON nulos se deserializan como arrays vacíos `[]`

---

## 7. Próximos Pasos (Opcional)

- Agregar endpoint `POST /organizations/{id}/reject` para volver de IN_REVIEW a DRAFT
- Implementar aggregates para multi-selección (technology, impactArea, badge)
- Agregar índices en DB para country, sector_primary, organization_type

---

## 8. Troubleshooting

**Error: "unknown column 'description'"**
→ No aplicaste la migración. Ejecuta el paso 1.

**Error: "description is required"**
→ Asegúrate de enviar el campo `description` en el JSON (aunque sea vacío para DRAFT, se valida en Publish).

**Error: "invalid transition"**
→ Respeta el flujo: DRAFT → IN_REVIEW → PUBLISHED. No puedes saltar pasos.

---

¡Listo! El backend ahora está 100% alineado con el documento Word.
