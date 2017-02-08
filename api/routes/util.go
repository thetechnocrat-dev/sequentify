package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type ErrorResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

func sendErrorResponse(w http.ResponseWriter, errorString string, errorCode int) error {
	res, err := json.Marshal(ErrorResponse{Success: false, Error: errorString})
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(errorCode)
	fmt.Fprintf(w, string(res))
	if err != nil {
		return err
	}

	return nil
}

func getFrontendUrl() string {
	if os.Getenv("APP_ENV") == "production" {
		return "http://sequentify.com"
	} else {
		return "http://localhost:5000"
	}
}

func setCors(w http.ResponseWriter) {
	frontendUrl := getFrontendUrl()
	w.Header().Set("Access-Control-Allow-Origin", frontendUrl)
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
