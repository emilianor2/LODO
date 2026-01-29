package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPass     string
	DBName     string
	AdminToken string
}

func Load() Config {
	// Intentar cargar el archivo .env si existe
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	return Config{
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("DB_PORT"),
		DBUser:     os.Getenv("DB_USER"),
		DBPass:     os.Getenv("DB_PASS"),
		DBName:     os.Getenv("DB_NAME"),
		AdminToken: os.Getenv("ADMIN_TOKEN"),
	}
}
