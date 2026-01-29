package taxonomies

// Taxonomy representa un elemento de una lista controlada.
type Taxonomy struct {
	ID        int    `json:"id"`
	Category  string `json:"category"`
	Value     string `json:"value"`
	Label     string `json:"label"`
	SortOrder int    `json:"sortOrder"`
}

// GroupedTaxonomies es un mapa de categorías a listas de taxonomías.
type GroupedTaxonomies map[string][]Taxonomy
