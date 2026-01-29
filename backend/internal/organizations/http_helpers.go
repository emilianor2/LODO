package organizations

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
)

// decodeJSON decodifica el body JSON de un request HTTP.
// Aplica validaciones básicas y devuelve errores claros.
func decodeJSON(r *http.Request, dst interface{}) error {
	if r.Body == nil {
		return errors.New("request body is empty")
	}

	defer r.Body.Close()

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(dst); err != nil {
		return err
	}

	return nil
}

func parseInt(s string) (int, error) {
	return strconv.Atoi(s)
}
