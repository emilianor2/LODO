package taxonomies

import (
	"database/sql"
	"fmt"
)

type Repository interface {
	FindAll() ([]Taxonomy, error)
	FindByCategory(category string) ([]Taxonomy, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

func (r *repository) FindAll() ([]Taxonomy, error) {
	query := `SELECT id, category, value, label, sort_order FROM taxonomies WHERE is_active = 1 ORDER BY category, sort_order, label`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error querying taxonomies: %w", err)
	}
	defer rows.Close()

	var result []Taxonomy
	for rows.Next() {
		var t Taxonomy
		var label sql.NullString
		if err := rows.Scan(&t.ID, &t.Category, &t.Value, &label, &t.SortOrder); err != nil {
			return nil, fmt.Errorf("error scanning taxonomy: %w", err)
		}
		if label.Valid {
			t.Label = label.String
		} else {
			t.Label = t.Value // Fallback
		}
		result = append(result, t)
	}
	return result, nil
}

func (r *repository) FindByCategory(category string) ([]Taxonomy, error) {
	query := `SELECT id, category, value, label, sort_order FROM taxonomies WHERE category = ? AND is_active = 1 ORDER BY sort_order, label`
	rows, err := r.db.Query(query, category)
	if err != nil {
		return nil, fmt.Errorf("error querying taxonomies by category: %w", err)
	}
	defer rows.Close()

	var result []Taxonomy
	for rows.Next() {
		var t Taxonomy
		var label sql.NullString
		if err := rows.Scan(&t.ID, &t.Category, &t.Value, &label, &t.SortOrder); err != nil {
			return nil, fmt.Errorf("error scanning taxonomy: %w", err)
		}
		if label.Valid {
			t.Label = label.String
		} else {
			t.Label = t.Value
		}
		result = append(result, t)
	}
	return result, nil
}
