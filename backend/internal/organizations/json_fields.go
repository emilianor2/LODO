package organizations

import (
	"encoding/json"
)

// toJSON convierte una estructura (usualmente un slice) a un puntero de string JSON.
// Si el valor está vacío o es nil, devuelve nil para guardar NULL en la DB.
func toJSON(v any) *string {
	if v == nil {
		return nil
	}

	// Caso específico para slices
	if s, ok := v.([]string); ok && len(s) == 0 {
		return nil
	}

	b, err := json.Marshal(v)
	if err != nil {
		return nil
	}
	res := string(b)
	return &res
}

// fromJSON deserializa un string JSON de la DB hacia el destino (dst).
// Maneja casos donde el string es nil o vacío.
func fromJSON(s *string, dst any) {
	if s == nil || *s == "" || *s == "null" {
		return
	}
	_ = json.Unmarshal([]byte(*s), dst)
}
