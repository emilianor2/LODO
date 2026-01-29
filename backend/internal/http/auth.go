package httpmw

import (
	"backend/internal/auth"
	"backend/internal/config"
	"context"
	"net/http"
	"strings"
)

type contextKey string

const UserContextKey contextKey = "user"

func Auth(cfg config.Config, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// En desarrollo, si no hay token configurado, dejamos pasar (opcional)
		if cfg.AdminToken == "" {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if parts[1] != cfg.AdminToken {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// AuthWithUser verifica el token y permite acceso a admins (por token estático o por usuario admin)
func AuthWithUser(cfg config.Config, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		token := parts[1]

		// Primero verificar si es el token estático de admin (backward compatible)
		if cfg.AdminToken != "" && token == cfg.AdminToken {
			next.ServeHTTP(w, r)
			return
		}

		// Verificar si es un token de usuario
		user := auth.GetUserFromToken(token)
		if user == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Verificar que el usuario sea admin
		if user.Role != "admin" {
			http.Error(w, "Forbidden: admin access required", http.StatusForbidden)
			return
		}

		// Agregar usuario al contexto
		ctx := context.WithValue(r.Context(), UserContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
