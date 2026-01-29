package lifecycle

import "errors"

// AllowedTransitions define qué cambios de estado están permitidos.
// Corresponde exactamente al Word (Fase 1.4).
var AllowedTransitions = map[string][]string{
	"DRAFT":     {"IN_REVIEW"},
	"IN_REVIEW": {"PUBLISHED", "DRAFT"},
	"PUBLISHED": {"ARCHIVED"},
	"ARCHIVED":  {},
}

// CanTransition valida si un estado puede pasar a otro.
func CanTransition(from string, to string) bool {
	allowed, ok := AllowedTransitions[from]
	if !ok {
		return false
	}

	for _, state := range allowed {
		if state == to {
			return true
		}
	}
	return false
}

// ValidateTransition devuelve error si la transición no es válida.
func ValidateTransition(from string, to string) error {
	if !CanTransition(from, to) {
		return errors.New("invalid lifecycle transition")
	}
	return nil
}
