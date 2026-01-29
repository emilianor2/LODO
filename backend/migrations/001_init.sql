CREATE TABLE organizations (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization_type VARCHAR(50) NOT NULL,
  sector_primary VARCHAR(50) NOT NULL,
  sector_secondary VARCHAR(50),
  stage VARCHAR(50),
  outcome_status VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  website VARCHAR(255),
  notes TEXT,
  status ENUM('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED') DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(50),
  entity_id CHAR(36),
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(100),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
