package organizations

import (
	"fmt"
	"strings"
)

// Normalize limpia y valida los datos de una organización antes de persistirlos.
func Normalize(org *Organization) error {
	// 1. Trim en strings obligatorias
	org.ID = strings.TrimSpace(org.ID)
	org.Name = strings.TrimSpace(org.Name)
	org.OrganizationType = strings.TrimSpace(org.OrganizationType)
	org.SectorPrimary = strings.TrimSpace(org.SectorPrimary)
	org.OutcomeStatus = strings.TrimSpace(org.OutcomeStatus)
	org.Country = strings.TrimSpace(org.Country)
	org.Region = strings.TrimSpace(org.Region)
	org.City = strings.TrimSpace(org.City)

	// 2. Validar campos ID y Nombre (mínimo para DRAFT)
	if org.ID == "" {
		return fmt.Errorf("id is required")
	}
	if org.Name == "" {
		return fmt.Errorf("name is required")
	}

	// 3. Normalizar campos opcionales (*string) incluyendo Description
	org.Description = normalizeOptional(org.Description)
	org.SectorSecondary = normalizeOptional(org.SectorSecondary)
	org.Stage = normalizeOptional(org.Stage)
	org.Website = normalizeOptional(org.Website)
	org.Notes = normalizeOptional(org.Notes)
	org.LogoURL = normalizeOptional(org.LogoURL)
	org.LinkedInURL = normalizeOptional(org.LinkedInURL)
	org.ContactEmail = normalizeOptional(org.ContactEmail)
	org.ContactPhone = normalizeOptional(org.ContactPhone)
	org.InstagramURL = normalizeOptional(org.InstagramURL)

	// 4. Validar consistencia de coordenadas
	if (org.Lat != nil && org.Lng == nil) || (org.Lat == nil && org.Lng != nil) {
		return fmt.Errorf("both lat and lng must be provided if coordinates are included")
	}

	// 5. Validar año (rango razonable)
	if org.YearFounded != nil {
		currentYear := 2026 // Podrías usar time.Now().Year() pero el prompt dice "hasta hoy"
		if *org.YearFounded < 1800 || *org.YearFounded > currentYear {
			return fmt.Errorf("yearFounded must be between 1800 and %d", currentYear)
		}
	}

	return nil
}

func normalizeOptional(s *string) *string {
	if s == nil {
		return nil
	}
	trimmed := strings.TrimSpace(*s)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}

// ValidateForPublish realiza el checklist del Word antes de permitir el paso a PUBLISHED.
func ValidateForPublish(org *Organization) error {
	// Re-validar campos básicos obligatorios
	if org.Name == "" || org.OrganizationType == "" || org.SectorPrimary == "" ||
		org.OutcomeStatus == "" || org.Country == "" || org.Region == "" || org.City == "" {
		return fmt.Errorf("missing required geographic or categorization fields")
	}

	// Reglas del Word
	// Description obligatoria y con longitud mínima
	if org.Description == nil || len(*org.Description) < 20 {
		return fmt.Errorf("description is too short (min 20 chars required for publishing)")
	}

	// Debe existir website o linkedin
	if (org.Website == nil || *org.Website == "") && (org.LinkedInURL == nil || *org.LinkedInURL == "") {
		return fmt.Errorf("at least one contact link (Website or LinkedIn) is required to publish")
	}

	// Si es Startup -> Stage obligatorio
	if strings.EqualFold(org.OrganizationType, "Startup") {
		if org.Stage == nil || *org.Stage == "" {
			return fmt.Errorf("stage is mandatory for organizations of type Startup")
		}
	}

	return nil
}
