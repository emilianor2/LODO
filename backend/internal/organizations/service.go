package organizations

import (
	"backend/internal/audit"
	"backend/internal/taxonomies"
	"fmt"
	"sync"
	"time"
)

type Service struct {
	repo      *Repository
	auditRepo *audit.Repository
	taxRepo   taxonomies.Repository

	taxCache      map[string]map[string]bool
	taxCacheTime  time.Time
	taxCacheMutex sync.RWMutex
}

func NewService(repo *Repository, auditRepo *audit.Repository, taxRepo taxonomies.Repository) *Service {
	return &Service{
		repo:      repo,
		auditRepo: auditRepo,
		taxRepo:   taxRepo,
	}
}

// Create registra una nueva organización como DRAFT.
func (s *Service) Create(org *Organization) error {
	if err := s.ValidateTaxonomies(org); err != nil {
		return err
	}
	org.Status = StatusDraft
	return s.repo.Create(org)
}

// Update actualiza los datos de la organización.
func (s *Service) Update(org *Organization) error {
	if err := s.ValidateTaxonomies(org); err != nil {
		return err
	}
	// No permitimos actualizar status directo desde aquí
	existing, err := s.repo.FindByID(org.ID)
	if err != nil {
		return err
	}
	org.Status = existing.Status
	return s.repo.Update(org)
}

// Delete elimina o archiva una organización según su estado.
func (s *Service) Delete(id string, force bool) error {
	org, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if org.Status == StatusPublished {
		// Si está publicado, no borramos físico, archivamos.
		_ = s.auditRepo.Log(&audit.AuditLog{
			EntityID:    id,
			EntityType:  "Organization",
			Action:      "ARCHIVE",
			FromStatus:  "PUBLISHED",
			ToStatus:    "ARCHIVED",
			PerformedBy: "system/delete-request",
		})
		_ = s.repo.UpdateStatus(id, StatusArchived)
		return fmt.Errorf("published organizations cannot be hard deleted; status has been set to ARCHIVED instead")
	}

	if org.Status == StatusArchived && !force {
		return fmt.Errorf("organization is already archived, use force=true to hard delete")
	}

	// DRAFT o IN_REVIEW (o ARCHIVED con force) -> Hard delete
	_ = s.auditRepo.Log(&audit.AuditLog{
		EntityID:    id,
		EntityType:  "Organization",
		Action:      "DELETE",
		FromStatus:  string(org.Status),
		ToStatus:    "DELETED",
		PerformedBy: "admin",
	})
	return s.repo.Delete(id)
}

// SubmitForReview mueve a IN_REVIEW. Permite retroceder de PUBLISHED o volver de DRAFT.
func (s *Service) SubmitForReview(id string) error {
	org, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	// Transición válida: DRAFT -> IN_REVIEW o PUBLISHED -> IN_REVIEW (re-evaluación)
	if org.Status != StatusDraft && org.Status != StatusPublished && org.Status != StatusArchived {
		return fmt.Errorf("invalid transition to IN_REVIEW from %s", org.Status)
	}

	return s.repo.UpdateStatus(id, StatusInReview)
}

// Publish realiza el checklist del Word antes de publicar.
func (s *Service) Publish(id string) error {
	org, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	// Solo se puede publicar desde IN_REVIEW (proceso formal)
	if org.Status != StatusInReview {
		return fmt.Errorf("organization must be in IN_REVIEW status to be published (current: %s)", org.Status)
	}

	// Aplicar checklist del Word
	if err := ValidateForPublish(org); err != nil {
		return fmt.Errorf("publish validation failed: %w", err)
	}

	return s.repo.UpdateStatus(id, StatusPublished)
}

// Archive mueve a ARCHIVED desde cualquier estado excepto si ya está archivado.
func (s *Service) Archive(id string) error {
	org, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if org.Status == StatusArchived {
		return nil
	}

	return s.repo.UpdateStatus(id, StatusArchived)
}

// Reject devuelve a DRAFT desde IN_REVIEW para correcciones.
func (s *Service) Reject(id string) error {
	org, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if org.Status != StatusInReview {
		return fmt.Errorf("can only reject from IN_REVIEW")
	}

	return s.repo.UpdateStatus(id, StatusDraft)
}

// ValidateTaxonomies verifica que los campos seleccionados existan en las listas controladas.
func (s *Service) ValidateTaxonomies(org *Organization) error {
	s.taxCacheMutex.RLock()
	cacheValid := !s.taxCacheTime.IsZero() && time.Since(s.taxCacheTime) < 60*time.Second
	s.taxCacheMutex.RUnlock()

	var grouped map[string]map[string]bool

	if cacheValid {
		s.taxCacheMutex.RLock()
		grouped = s.taxCache
		s.taxCacheMutex.RUnlock()
	} else {
		// Cache miss or expired
		allTaxonomies, err := s.taxRepo.FindAll()
		if err != nil {
			return fmt.Errorf("could not load taxonomies for validation: %w", err)
		}

		newCache := make(map[string]map[string]bool)
		for _, t := range allTaxonomies {
			if newCache[t.Category] == nil {
				newCache[t.Category] = make(map[string]bool)
			}
			newCache[t.Category][t.Value] = true
		}

		s.taxCacheMutex.Lock()
		s.taxCache = newCache
		s.taxCacheTime = time.Now()
		grouped = s.taxCache
		s.taxCacheMutex.Unlock()
	}

	// Validar campos simples
	if org.OrganizationType != "" && !grouped["organizationType"][org.OrganizationType] {
		return fmt.Errorf("invalid organizationType: %s", org.OrganizationType)
	}
	if org.SectorPrimary != "" && !grouped["sectorPrimary"][org.SectorPrimary] {
		return fmt.Errorf("invalid sectorPrimary: %s", org.SectorPrimary)
	}
	if org.Stage != nil && *org.Stage != "" && !grouped["stage"][*org.Stage] {
		return fmt.Errorf("invalid stage: %s", *org.Stage)
	}
	if org.OutcomeStatus != "" && !grouped["outcomeStatus"][org.OutcomeStatus] {
		return fmt.Errorf("invalid outcomeStatus: %s", org.OutcomeStatus)
	}

	// Validar campos multi-selección
	if err := s.checkMulti(org.ImpactArea, grouped["impactArea"], "impactArea"); err != nil {
		return err
	}
	if err := s.checkMulti(org.Technology, grouped["technology"], "technology"); err != nil {
		return err
	}
	if err := s.checkMulti(org.Badge, grouped["badge"], "badge"); err != nil {
		return err
	}
	// Tags se deja libre (no validar)

	return nil
}

func (s *Service) checkMulti(values []string, validMap map[string]bool, fieldName string) error {
	if validMap == nil {
		return nil // Si no hay lista controlada para esta categoría, permitimos libre
	}
	for _, v := range values {
		if !validMap[v] {
			return fmt.Errorf("invalid %s: %s", fieldName, v)
		}
	}
	return nil
}
