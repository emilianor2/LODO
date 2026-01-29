package main

import (
	"log"
	"net/http"
	"strings"

	"backend/internal/audit"
	"backend/internal/auth"
	"backend/internal/config"
	"backend/internal/database"
	"backend/internal/geocoding"
	httpmw "backend/internal/http"
	"backend/internal/organizations"
	"backend/internal/taxonomies"
)

func main() {
	// 1. Cargar configuración (variables de entorno)
	cfg := config.Load()

	// 2. Conectar a la base de datos
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("MariaDB connected")

	// 3. Inicializar capas del módulo Organizations
	orgRepo := organizations.NewRepository(db)
	auditRepo := audit.NewRepository(db)
	taxRepo := taxonomies.NewRepository(db)
	orgService := organizations.NewService(orgRepo, auditRepo, taxRepo)
	geocoder := geocoding.NewNominatimClient("LODO-Geocode-MVP")
	orgHandler := organizations.NewHandler(orgService, orgRepo, geocoder)

	taxHandler := taxonomies.NewHandler(taxRepo)

	// Inicializar módulo Auth
	authRepo := auth.NewRepository(db)
	authHandler := auth.NewHandler(authRepo)

	// 4. Router HTTP
	mux := http.NewServeMux()

	// --- RUTAS PÚBLICAS ---
	publicMux := http.NewServeMux()

	// Health check (infraestructura)
	publicMux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Endpoint público (mapa)
	publicMux.HandleFunc("/public/organizations", orgHandler.ListPublic)
	publicMux.HandleFunc("/public/organizations/aggregates", orgHandler.Aggregates)
	publicMux.HandleFunc("/public/organizations/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/public/organizations/" {
			http.Error(w, "Not found", http.StatusNotFound)
			return
		}
		orgHandler.GetPublicByID(w, r)
	})

	publicMux.HandleFunc("/public/taxonomies", taxHandler.ListPublic)

	// --- RUTAS DE AUTH ---
	publicMux.HandleFunc("/auth/login", authHandler.Login)
	publicMux.HandleFunc("/auth/register", authHandler.Register)
	publicMux.HandleFunc("/auth/me", authHandler.Me)
	publicMux.HandleFunc("/auth/logout", authHandler.Logout)

	// --- RUTAS DE ADMIN ---
	adminMux := http.NewServeMux()

	// Listar todas (MVP Admin)
	adminMux.HandleFunc("/organizations", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			orgHandler.List(w, r)
			return
		}
		if r.Method == http.MethodPost {
			orgHandler.Create(w, r)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	// Lifecycle & CRUD by ID
	adminMux.HandleFunc("/organizations/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		switch {
		case strings.HasSuffix(path, "/review"):
			orgHandler.SubmitForReview(w, r)
		case strings.HasSuffix(path, "/publish"):
			orgHandler.Publish(w, r)
		case strings.HasSuffix(path, "/archive"):
			orgHandler.Archive(w, r)
		case strings.HasSuffix(path, "/geocode"):
			orgHandler.Geocode(w, r)
		case strings.HasSuffix(path, "/coordinates"):
			orgHandler.PatchCoordinates(w, r)
		default:
			// Si no tiene sufijo conocido, intentamos CRUD base
			switch r.Method {
			case http.MethodGet:
				orgHandler.GetByID(w, r)
			case http.MethodPut:
				orgHandler.Update(w, r)
			case http.MethodDelete:
				orgHandler.Delete(w, r)
			default:
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			}
		}
	})

	// Unir todo en el mux principal
	mux.Handle("/public/", publicMux)
	mux.Handle("/auth/", publicMux)
	mux.Handle("/organizations", httpmw.AuthWithUser(cfg, adminMux))
	mux.Handle("/organizations/", httpmw.AuthWithUser(cfg, adminMux))
	mux.Handle("/health", publicMux)

	// 5. Levantar servidor con CORS
	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", httpmw.CORS(mux)))
}
