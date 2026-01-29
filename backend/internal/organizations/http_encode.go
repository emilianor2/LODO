package organizations

import (
	"encoding/json"
	"net/http"
)

func encodeJSON(w http.ResponseWriter, data interface{}) {
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	encoder.Encode(data)
}
