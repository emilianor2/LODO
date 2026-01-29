package audit

import (
	"database/sql"
	"fmt"
)

type Repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{DB: db}
}

func (r *Repository) Log(event interface{}) error {
	auditEvent, ok := event.(*AuditLog)
	if !ok {
		return fmt.Errorf("unexpected audit event type: %T", event)
	}

	_, err := r.DB.Exec(`
		INSERT INTO audit_logs
		(entity_type, entity_id, action, from_status, to_status, performed_by)
		VALUES (?, ?, ?, ?, ?, ?)`,
		auditEvent.EntityType,
		auditEvent.EntityID,
		auditEvent.Action,
		auditEvent.FromStatus,
		auditEvent.ToStatus,
		auditEvent.PerformedBy,
	)
	return err
}
