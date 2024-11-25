package main

import "net/http"

//when production ready, use this commands:
//CGO_ENABLED=0 GOOS=(the server operating system) GOARCH=(the server architecture) go build -o gomovies ./cmd/api

func (app *application) enableCors(h http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") //change the url to the production when ready
		//w.Header().Set("Access-Control-Allow-Credentials", "true") 
		//delete the code above from if statement and put it outside the if statement below when ready to go

		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Credentials", "true") // delete this when production ready and paste it outside the if statement
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, X-CSRF-Token, Authorization")
			return
		} else {
			h.ServeHTTP(w,r)
		}
	})
}


func (app *application) authRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _, err := app.auth.GetTokenFromHeaderAndVerify(w, r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}