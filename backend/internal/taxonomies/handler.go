package taxonomies

import (
	"encoding/json"
	"net/http"
)

type Handler struct {
	repo Repository
}

func NewHandler(repo Repository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) ListPublic(w http.ResponseWriter, r *http.Request) {
	items, err := h.repo.FindAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Agrupar por categoría
	grouped := make(GroupedTaxonomies)
	for _, item := range items {
		grouped[item.Category] = append(grouped[item.Category], item)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(grouped)
}
