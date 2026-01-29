package audit

import "time"

// AuditLog representa un evento de auditoría del sistema.
type AuditLog struct {
	ID             int64
	EntityType     string
	EntityID       string
	Action         string
	FromStatus     string
	ToStatus       string
	PerformedBy    string
	PerformedAt    time.Time
}
