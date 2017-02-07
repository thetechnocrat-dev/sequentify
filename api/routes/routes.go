package routes

import (
	"encoding/json"
	"fmt"
	"github.com/McMenemy/sequentify/api/services/aligner"
	"github.com/McMenemy/sequentify/api/services/database"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"os"
)

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

func CorsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
}

func AlignHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
	w.Header().Set("Content-Type", "application/json")

	type AlignData struct {
		SeqA              string
		SeqB              string
		MatchScore        float64
		MismatchPenalty   float64
		GapPenalty        float64
		GapOpeningPenalty float64
	}

	decoder := json.NewDecoder(r.Body)
	var alignData AlignData
	err := decoder.Decode(&alignData)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	alignment := aligner.Align(alignData.SeqA, alignData.SeqB, alignData.MatchScore,
		alignData.MismatchPenalty, alignData.GapPenalty, alignData.GapOpeningPenalty)
	res, err := json.Marshal(alignment)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(res)
}

func AlignSearchHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
	w.Header().Set("Content-Type", "application/json")

	type AlignSearchData struct {
		TargetSeq         string
		Sequences         [][]string
		MatchScore        float64
		MismatchPenalty   float64
		GapPenalty        float64
		GapOpeningPenalty float64
	}

	decoder := json.NewDecoder(r.Body)
	var alignSearchData AlignSearchData
	err := decoder.Decode(&alignSearchData)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	alignments := aligner.AlignSearch(alignSearchData.TargetSeq, alignSearchData.Sequences,
		alignSearchData.MatchScore, alignSearchData.MismatchPenalty, alignSearchData.GapPenalty,
		alignSearchData.GapOpeningPenalty)
	res, err := json.Marshal(alignments)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(res)
}

func IndexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	query :=
		`INSERT INTO
			appusers ("username","password")
		VALUES
			($1, $2)
		RETURNING
			id`
	var studentID int
	stmt, err := database.DB.Prepare(query)
	err = stmt.QueryRow("Lee", "testing").Scan(&studentID)
	if err != nil {
		log.Println(err)
		fmt.Fprintf(w, "This is sequentify's resful API - db query failed")
	}
	log.Println(studentID)
	fmt.Fprintf(w, "This a is sequentify's resftful API: %s", studentID)
}
