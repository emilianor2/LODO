package organizations

import (
	"backend/internal/geocoding"
	"net/http"
	"strings"
)

// Handler expone los endpoints HTTP para organizaciones.
// NO contiene lógica de negocio.
type Handler struct {
	Service  *Service
	Repo     *Repository
	Geocoder *geocoding.NominatimClient
}

func NewHandler(service *Service, repo *Repository, geocoder *geocoding.NominatimClient) *Handler {
	return &Handler{
		Service:  service,
		Repo:     repo,
		Geocoder: geocoder,
	}
}

// Create crea una organización en estado DRAFT.
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var org Organization

	if err := decodeJSON(r, &org); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Estado inicial
	org.Status = StatusDraft

	// Normalización y validación
	if err := Normalize(&org); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.Service.Create(&org); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	encodeJSON(w, org)
}

// Update actualiza los campos permitidos de una organización.
func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := extractID(r.URL.Path)
	if id == "" {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var org Organization
	if err := decodeJSON(r, &org); err != nil {
		http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
		return
	}

	org.ID = id
	if err := Normalize(&org); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.Service.Update(&org); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	encodeJSON(w, org)
}

// GetByID devuelve el detalle admin de una organización (sin importar status).
func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := extractID(r.URL.Path)
	if id == "" {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	org, err := h.Repo.FindByID(id)
	if err != nil {
		http.Error(w, "Organization not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	encodeJSON(w, org)
}

// Delete elimina o archiva una organización.
func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := extractID(r.URL.Path)
	if id == "" {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	force := r.URL.Query().Get("force") == "true"

	if err := h.Service.Delete(id, force); err != nil {
		if strings.Contains(err.Error(), "force=true") {
			http.Error(w, err.Error(), http.StatusConflict) // 409
		} else if strings.Contains(err.Error(), "not found") {
			http.Error(w, "Not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// SubmitForReview mueve una organización a IN_REVIEW.
func (h *Handler) SubmitForReview(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// /organizations/{id}/review
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

	if len(parts) < 2 {
		http.Error(w, "invalid URL", http.StatusBadRequest)
		return
	}

	id := parts[1]

	if err := h.Service.SubmitForReview(id); err != nil {
		if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows") {
			http.Error(w, err.Error(), http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		return
	}

	w.WriteHeader(http.StatusOK)
}

// Publish publica una organización.
func (h *Handler) Publish(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// /organizations/{id}/publish
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

	if len(parts) < 2 {
		http.Error(w, "invalid URL", http.StatusBadRequest)
		return
	}

	id := parts[1]

	if err := h.Service.Publish(id); err != nil {
		if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows") {
			http.Error(w, err.Error(), http.StatusNotFound)
		} else if strings.Contains(err.Error(), "validation") || strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "must be") {
			http.Error(w, err.Error(), http.StatusUnprocessableEntity) // 422
		} else {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		return
	}

	w.WriteHeader(http.StatusOK)
}

// Archive archiva una organización.
func (h *Handler) Archive(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// /organizations/{id}/archive
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

	if len(parts) < 2 {
		http.Error(w, "invalid URL", http.StatusBadRequest)
		return
	}

	id := parts[1]

	if err := h.Service.Archive(id); err != nil {
		if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows") {
			http.Error(w, err.Error(), http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		return
	}

	w.WriteHeader(http.StatusOK)
}

// --- Helpers ---

func extractID(path string) string {
	parts := strings.Split(strings.Trim(path, "/"), "/")
	if len(parts) == 0 {
		return ""
	}
	// Si la ruta es /organizations/{id}
	if parts[0] == "organizations" && len(parts) == 2 {
		return parts[1]
	}
	// Si la ruta es /public/organizations/{id}
	if parts[0] == "public" && parts[1] == "organizations" && len(parts) == 3 {
		return parts[2]
	}
	return ""
}

// ListPublic devuelve solo organizaciones publicadas (para el mapa)
func (h *Handler) ListPublic(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	qp := r.URL.Query()
	params := make(map[string]string)
	for k, v := range qp {
		if len(v) > 0 {
			params[k] = v[0]
		}
	}
	params["status"] = string(StatusPublished)

	orgs, err := h.Repo.FindFiltered(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	encodeJSON(w, orgs)
}

// Aggregates devuelve los filtros dinámicos y sus conteos.
func (h *Handler) Aggregates(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	qp := r.URL.Query()
	params := make(map[string]string)
	for k, v := range qp {
		if len(v) > 0 {
			params[k] = v[0]
		}
	}

	data, err := h.Repo.GetAggregates(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	encodeJSON(w, data)
}

// GetPublicByID devuelve el detalle de una organización publicada.
func (h *Handler) GetPublicByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := extractID(r.URL.Path)
	if id == "" {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	org, err := h.Repo.FindPublishedByID(id)
	if err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	encodeJSON(w, org)
}

// List admin version
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	qp := r.URL.Query()
	params := make(map[string]string)
	for k, v := range qp {
		if len(v) > 0 {
			params[k] = v[0]
		}
	}

	orgs, err := h.Repo.FindFiltered(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	encodeJSON(w, orgs)
}

// Geocode busca coordenadas para una organización existente.
func (h *Handler) Geocode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Esperamos /organizations/{id}/geocode
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 2 {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}
	id := parts[1]

	org, err := h.Repo.FindByID(id)
	if err != nil {
		http.Error(w, "Organization not found", http.StatusNotFound)
		return
	}

	lat, lng, err := h.Geocoder.Geocode(org.City, org.Region, org.Country)
	if err != nil {
		if err.Error() == "no results found" {
			http.Error(w, "Coordinates not found for this location", http.StatusNotFound)
		} else {
			http.Error(w, "Geocoding service error: "+err.Error(), http.StatusBadGateway)
		}
		return
	}

	if err := h.Repo.UpdateCoordinates(id, lat, lng); err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	updatedOrg, _ := h.Repo.FindByID(id)
	w.Header().Set("Content-Type", "application/json")
	encodeJSON(w, updatedOrg)
}

// PatchCoordinates actualiza manualmente las coordenadas.
func (h *Handler) PatchCoordinates(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 2 {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}
	id := parts[1]

	var coords struct {
		Lat float64 `json:"lat"`
		Lng float64 `json:"lng"`
	}

	if err := decodeJSON(r, &coords); err != nil {
		http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.Repo.UpdateCoordinates(id, coords.Lat, coords.Lng); err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	updatedOrg, _ := h.Repo.FindByID(id)
	w.Header().Set("Content-Type", "application/json")
	encodeJSON(w, updatedOrg)
}
