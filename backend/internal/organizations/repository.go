package organizations

import (
	"database/sql"
	"fmt"
	"strings"
)

type Repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{DB: db}
}

const orgSelectColumns = `
	id, name, organization_type, sector_primary, sector_secondary,
	stage, outcome_status, country, region, city,
	lat, lng, website, notes, status, created_at, updated_at,
	description, year_founded, logo_url, linkedin_url, contact_email,
	contact_phone, instagram_url, tags_json, technology_json,
	impact_area_json, badge_json
`

func (r *Repository) scanOrg(scanner interface {
	Scan(dest ...any) error
}) (*Organization, error) {
	var org Organization
	var tagsJ, techJ, impactJ, badgeJ *string

	err := scanner.Scan(
		&org.ID, &org.Name, &org.OrganizationType, &org.SectorPrimary, &org.SectorSecondary,
		&org.Stage, &org.OutcomeStatus, &org.Country, &org.Region, &org.City,
		&org.Lat, &org.Lng, &org.Website, &org.Notes, &org.Status, &org.CreatedAt, &org.UpdatedAt,
		&org.Description, &org.YearFounded, &org.LogoURL, &org.LinkedInURL, &org.ContactEmail,
		&org.ContactPhone, &org.InstagramURL, &tagsJ, &techJ, &impactJ, &badgeJ,
	)
	if err != nil {
		return nil, err
	}

	fromJSON(tagsJ, &org.Tags)
	fromJSON(techJ, &org.Technology)
	fromJSON(impactJ, &org.ImpactArea)
	fromJSON(badgeJ, &org.Badge)

	return &org, nil
}

func (r *Repository) Create(org *Organization) error {
	_, err := r.DB.Exec(`
		INSERT INTO organizations (
			id, name, organization_type, sector_primary, sector_secondary,
			stage, outcome_status, country, region, city,
			lat, lng, website, notes, status,
			description, year_founded, logo_url, linkedin_url, contact_email,
			contact_phone, instagram_url, tags_json, technology_json,
			impact_area_json, badge_json
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		org.ID, org.Name, org.OrganizationType, org.SectorPrimary, org.SectorSecondary,
		org.Stage, org.OutcomeStatus, org.Country, org.Region, org.City,
		org.Lat, org.Lng, org.Website, org.Notes, org.Status,
		org.Description, org.YearFounded, org.LogoURL, org.LinkedInURL, org.ContactEmail,
		org.ContactPhone, org.InstagramURL, toJSON(org.Tags), toJSON(org.Technology),
		toJSON(org.ImpactArea), toJSON(org.Badge),
	)
	return err
}

func (r *Repository) Update(org *Organization) error {
	_, err := r.DB.Exec(`
		UPDATE organizations SET 
			name = ?, 
			organization_type = ?, 
			sector_primary = ?, 
			sector_secondary = ?,
			stage = ?, 
			outcome_status = ?, 
			country = ?, 
			region = ?, 
			city = ?,
			lat = ?, 
			lng = ?, 
			website = ?, 
			notes = ?,
			description = ?, 
			year_founded = ?, 
			logo_url = ?, 
			linkedin_url = ?, 
			contact_email = ?,
			contact_phone = ?, 
			instagram_url = ?, 
			tags_json = ?, 
			technology_json = ?,
			impact_area_json = ?, 
			badge_json = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?`,
		org.Name, org.OrganizationType, org.SectorPrimary, org.SectorSecondary,
		org.Stage, org.OutcomeStatus, org.Country, org.Region, org.City,
		org.Lat, org.Lng, org.Website, org.Notes,
		org.Description, org.YearFounded, org.LogoURL, org.LinkedInURL, org.ContactEmail,
		org.ContactPhone, org.InstagramURL, toJSON(org.Tags), toJSON(org.Technology),
		toJSON(org.ImpactArea), toJSON(org.Badge),
		org.ID,
	)
	return err
}

func (r *Repository) Delete(id string) error {
	_, err := r.DB.Exec(`DELETE FROM organizations WHERE id = ?`, id)
	return err
}

func (r *Repository) FindByID(id string) (*Organization, error) {
	row := r.DB.QueryRow(`SELECT `+orgSelectColumns+` FROM organizations WHERE id = ?`, id)
	return r.scanOrg(row)
}

func (r *Repository) UpdateStatus(id string, status OrganizationStatus) error {
	_, err := r.DB.Exec(`UPDATE organizations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, status, id)
	return err
}

func (r *Repository) FindPublishedByID(id string) (*Organization, error) {
	row := r.DB.QueryRow(`SELECT `+orgSelectColumns+` FROM organizations WHERE id = ? AND status = 'PUBLISHED'`, id)
	return r.scanOrg(row)
}

func (r *Repository) FindFiltered(params map[string]string) ([]Organization, error) {
	query := `SELECT ` + orgSelectColumns + ` FROM organizations WHERE 1=1`
	args := make([]interface{}, 0)

	whereSQL, args := r.buildWhereClause(params)
	query += whereSQL + " ORDER BY updated_at DESC"

	if limitStr := params["limit"]; limitStr != "" {
		if limit, err := parseInt(limitStr); err == nil {
			query += " LIMIT ?"
			args = append(args, limit)
			if offsetStr := params["offset"]; offsetStr != "" {
				if offset, err := parseInt(offsetStr); err == nil {
					query += " OFFSET ?"
					args = append(args, offset)
				}
			}
		}
	}

	rows, err := r.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	orgs := make([]Organization, 0)
	for rows.Next() {
		org, err := r.scanOrg(rows)
		if err != nil {
			return nil, err
		}
		orgs = append(orgs, *org)
	}
	return orgs, nil
}

// Para compatibilidad con código existente que usa FindPublishedFiltered
func (r *Repository) FindPublishedFiltered(
	country, sectorPrimary, organizationType, stage, outcomeStatus, q string,
	limit, offset int,
	onlyMappable bool,
) ([]Organization, error) {
	params := map[string]string{
		"status":           string(StatusPublished),
		"country":          country,
		"sectorPrimary":    sectorPrimary,
		"organizationType": organizationType,
		"stage":            stage,
		"outcomeStatus":    outcomeStatus,
		"q":                q,
		"limit":            fmt.Sprintf("%d", limit),
		"offset":           fmt.Sprintf("%d", offset),
	}
	if onlyMappable {
		params["onlyMappable"] = "true"
	}
	return r.FindFiltered(params)
}

func (r *Repository) FindAll() ([]Organization, error) {
	return r.FindFiltered(map[string]string{})
}

func (r *Repository) UpdateCoordinates(id string, lat, lng float64) error {
	_, err := r.DB.Exec(`UPDATE organizations SET lat = ?, lng = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, lat, lng, id)
	return err
}

// Aggregates remains the same but could use FindFiltered logic if needed.
func (r *Repository) GetAggregates(params map[string]string) (*AggregatesResponse, error) {
	// Ensure we only aggregate published orgs unless specified otherwise
	if params == nil {
		params = make(map[string]string)
	}
	// Force published status for public aggregates if not set
	if params["status"] == "" {
		params["status"] = string(StatusPublished)
	}

	whereSQL, args := r.buildWhereClause(params)

	resp := &AggregatesResponse{
		Countries:         make([]AggregateItem, 0),
		SectorsPrimary:    make([]AggregateItem, 0),
		SectorsSecondary:  make([]AggregateItem, 0),
		OrganizationTypes: make([]AggregateItem, 0),
		Stages:            make([]AggregateItem, 0),
		OutcomeStatuses:   make([]AggregateItem, 0),
	}
	var err error
	resp.Countries, err = r.fetchAggregation("country", false, whereSQL, args)
	if err != nil {
		return nil, err
	}
	resp.SectorsPrimary, err = r.fetchAggregation("sector_primary", false, whereSQL, args)
	if err != nil {
		return nil, err
	}
	resp.SectorsSecondary, err = r.fetchAggregation("sector_secondary", true, whereSQL, args)
	if err != nil {
		return nil, err
	}
	resp.OrganizationTypes, err = r.fetchAggregation("organization_type", false, whereSQL, args)
	if err != nil {
		return nil, err
	}
	resp.Stages, err = r.fetchAggregation("stage", true, whereSQL, args)
	if err != nil {
		return nil, err
	}
	resp.OutcomeStatuses, err = r.fetchAggregation("outcome_status", false, whereSQL, args)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (r *Repository) fetchAggregation(column string, ignoreEmpty bool, whereSQL string, args []interface{}) ([]AggregateItem, error) {
	query := "SELECT " + column + " as value, COUNT(*) as count FROM organizations WHERE 1=1 " + whereSQL

	if ignoreEmpty {
		query += " AND " + column + " IS NOT NULL AND " + column + " <> ''"
	}
	query += " GROUP BY " + column + " ORDER BY count DESC, value ASC"

	rows, err := r.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := make([]AggregateItem, 0)
	for rows.Next() {
		var i AggregateItem
		var ns sql.NullString
		if err := rows.Scan(&ns, &i.Count); err != nil {
			return nil, err
		}
		if ns.Valid {
			i.Value = ns.String
		} else {
			i.Value = ""
		}
		items = append(items, i)
	}
	return items, nil
}

func (r *Repository) buildWhereClause(params map[string]string) (string, []interface{}) {
	var query string
	args := make([]interface{}, 0)

	if status := params["status"]; status != "" {
		query += " AND status = ?"
		args = append(args, status)
	}
	if country := params["country"]; country != "" {
		query += " AND country = ?"
		args = append(args, country)
	}
	if sectorPrimary := params["sectorPrimary"]; sectorPrimary != "" {
		query += " AND sector_primary = ?"
		args = append(args, sectorPrimary)
	}
	if sectorSecondary := params["sectorSecondary"]; sectorSecondary != "" {
		query += " AND sector_secondary = ?"
		args = append(args, sectorSecondary)
	}
	if organizationType := params["organizationType"]; organizationType != "" {
		query += " AND organization_type = ?"
		args = append(args, organizationType)
	}
	if stage := params["stage"]; stage != "" {
		query += " AND stage = ?"
		args = append(args, stage)
	}
	if outcomeStatus := params["outcomeStatus"]; outcomeStatus != "" {
		query += " AND outcome_status = ?"
		args = append(args, outcomeStatus)
	}
	if q := params["q"]; q != "" {
		query += " AND (name LIKE ? OR city LIKE ? OR region LIKE ? OR country LIKE ? OR description LIKE ?)"
		like := "%" + q + "%"
		args = append(args, like, like, like, like, like)
	}
	if params["onlyMappable"] == "true" {
		query += " AND lat IS NOT NULL AND lng IS NOT NULL"
	}
	if bbox := params["bbox"]; bbox != "" {
		parts := strings.Split(bbox, ",")
		if len(parts) == 4 {
			query += " AND lat >= ? AND lng >= ? AND lat <= ? AND lng <= ?"
			args = append(args, parts[0], parts[1], parts[2], parts[3])
		}
	}
	return query, args
}
