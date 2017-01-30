package main

import (
	"encoding/json"
	"fmt"
	"github.com/McMenemy/sequentify/api/aligner"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"os"
)

func getFrontendUrl() string {
	if os.Getenv("ENV") == "production" {
		return "http://sequentify.com"
	} else {
		return "http://localhost:5000"
	}
}

func corsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	frontendUrl := getFrontendUrl()
	w.Header().Set("Access-Control-Allow-Origin", frontendUrl)
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func alignHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
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
		panic(err)
	}

	alignment := aligner.Align(alignData.SeqA, alignData.SeqB, alignData.MatchScore,
		alignData.MismatchPenalty, alignData.GapPenalty, alignData.GapOpeningPenalty)
	res, err := json.Marshal(alignment)
	if err != nil {
		panic(err)
	}

	frontendUrl := getFrontendUrl()
	w.Header().Set("Access-Control-Allow-Origin", frontendUrl)
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func indexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprintf(w, "This a is sequentify's resftful API")
}

func main() {
	router := httprouter.New()
	router.GET("/", indexHandler)
	router.OPTIONS("/*any", corsHandler)
	router.POST("/align", alignHandler)
	http.ListenAndServe(":8080", router)
}
