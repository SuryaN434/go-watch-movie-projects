package main

import (
	"backend/internal/repository"
	"backend/internal/repository/dbrepo"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"
)

const port = 8080

type application struct {
	DSN    string
	Domain string
	DB     repository.DatabaseRepo
	auth   Auth
	JWTSecret string
	JWTIssuer string
	JWTAudience string
	CookieDomain string
	APIKey string
}

func main() {
	//set application config
	var app application

	//read from command line
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres password=postgres dbname=movies sslmode=disable timezone=UTC connect_timeout=5", "Postgres connection string")
	flag.StringVar(&app.JWTSecret, "jwt-secret", "delicioussecret", "signing secret")
	flag.StringVar(&app.JWTIssuer, "jwt-issuer", "delicious@issuer.com", "signing issuer")
	flag.StringVar(&app.JWTAudience, "jwt-audience", "delicious@audience.com", "signing audience")
	flag.StringVar(&app.CookieDomain, "cookie-domain", "localhost", "cookie domain")
	flag.StringVar(&app.Domain, "domain", "delicious@domain.com", "domain")
	flag.StringVar(&app.APIKey, "api-key", "c528a02681f328d2e54daacffa755673", "api key")
	flag.Parse()

	//connect to database
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}

	app.DB = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.DB.Connection().Close()

	app.auth = Auth{
		Issuer: app.JWTIssuer,
		Audience: app.JWTAudience,
		Secret: app.JWTSecret,
		TokenExpiry: time.Minute * 15,
		RefreshExpiry: time.Hour * 24,
		CookiePath: "/",
		CookieName: "rfr_token",
		CookieDomain: app.CookieDomain,
	}

	log.Println("Starting application on port ", port)

	// http.HandleFunc("/", Hello)

	//start a web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
