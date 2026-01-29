-- Migración: Crear tabla de usuarios para autenticación
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Crear usuario admin por defecto
-- Email: admin@lodo.com
-- Password: admin123
INSERT INTO users (id, email, password_hash, name, role) VALUES 
('admin-001', 'admin@lodo.com', '$2a$10$K4QkkfyqVX0QJxayUdPUGeMEYut/z7yIjuSwAG4iBKIlfdaRR0nr2', 'Administrador', 'admin');
