package organizations

import "time"

// OrganizationStatus representa el estado del ciclo de vida del dato.
type OrganizationStatus string

const (
	StatusDraft     OrganizationStatus = "DRAFT"
	StatusInReview  OrganizationStatus = "IN_REVIEW"
	StatusPublished OrganizationStatus = "PUBLISHED"
	StatusArchived  OrganizationStatus = "ARCHIVED"
)

// Organization es la entidad única alineada a los requerimientos del proyecto.
type Organization struct {
	ID               string             `json:"id"`
	Name             string             `json:"name"`
	OrganizationType string             `json:"organizationType"`
	SectorPrimary    string             `json:"sectorPrimary"`
	SectorSecondary  *string            `json:"sectorSecondary,omitempty"`
	Stage            *string            `json:"stage,omitempty"`
	OutcomeStatus    string             `json:"outcomeStatus"`
	Country          string             `json:"country"`
	Region           string             `json:"region"`
	City             string             `json:"city"`
	Website          *string            `json:"website,omitempty"`
	Notes            *string            `json:"notes,omitempty"`
	Status           OrganizationStatus `json:"status"`
	CreatedAt        time.Time          `json:"createdAt"`
	UpdatedAt        time.Time          `json:"updatedAt"`
	Lat              *float64           `json:"lat,omitempty"`
	Lng              *float64           `json:"lng,omitempty"`

	// --- Nuevos campos alineados al Word ---
	Description  *string `json:"description,omitempty"`
	YearFounded  *int    `json:"yearFounded,omitempty"`
	LogoURL      *string `json:"logoUrl,omitempty"`
	LinkedInURL  *string `json:"linkedinUrl,omitempty"`
	ContactEmail *string `json:"contactEmail,omitempty"`
	ContactPhone *string `json:"contactPhone,omitempty"`
	InstagramURL *string `json:"instagramUrl,omitempty"`

	// Multi-selección (se guardan como JSON)
	Tags       []string `json:"tags,omitempty"`
	Technology []string `json:"technology,omitempty"`
	ImpactArea []string `json:"impactArea,omitempty"`
	Badge      []string `json:"badge,omitempty"`
}
