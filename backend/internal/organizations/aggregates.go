package organizations

// AggregateItem representa un valor y su frecuencia.
type AggregateItem struct {
	Value string `json:"value"`
	Count int    `json:"count"`
}

// AggregatesResponse agrupa los conteos para todas las dimensiones del mapa.
type AggregatesResponse struct {
	Countries         []AggregateItem `json:"countries"`
	SectorsPrimary    []AggregateItem `json:"sectorsPrimary"`
	SectorsSecondary  []AggregateItem `json:"sectorsSecondary"`
	OrganizationTypes []AggregateItem `json:"organizationTypes"`
	Stages            []AggregateItem `json:"stages"`
	OutcomeStatuses   []AggregateItem `json:"outcomeStatuses"`
}
