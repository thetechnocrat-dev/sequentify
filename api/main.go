package main

import (
	"encoding/json"
	"fmt"
	"github.com/McMenemy/aligner"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"os"
)

func getFrontendUrl() string {
	if os.Getenv("ENV") == "production" {
		return os.Getenv("FRONTEND_PROD_URL")
	} else {
		return os.Getenv("FRONTEND_DEV_URL")
	}
}

func corsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	frontendUrl := getFrontendUrl()
	w.Header().Set("Access-Control-Allow-Origin", frontendUrl)
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func alignHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	type SeqPair struct {
		SeqA string
		SeqB string
	}
	decoder := json.NewDecoder(r.Body)
	var seqs SeqPair
	err := decoder.Decode(&seqs)
	if err != nil {
		panic(err)
	}

	alignment := aligner.Align(seqs.SeqA, seqs.SeqB)
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
	fmt.Fprintf(w, "This is sequentify's resftful API")
}

func main() {
	router := httprouter.New()
	router.GET("/", indexHandler)
	router.OPTIONS("/*any", corsHandler)
	router.POST("/align", alignHandler)
	http.ListenAndServe(":8080", router)
}
