package main

import (
	"encoding/json"
	"fmt"
	"github.com/McMenemy/aligner"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"runtime"
)

func corsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func jsonHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	type Example struct {
		Pairs []string
	}
	e := Example{
		Pairs: []string{"gg", "g_", "aa", "tt"},
	}
	res, err := json.Marshal(e)
	if err != nil {
		fmt.Println("error:", err)
	}

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func postHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	type Post struct {
		Test []string
	}
	decoder := json.NewDecoder(r.Body)
	var pS Post
	err := decoder.Decode(&pS)
	if err != nil {
		panic(err)
	}
	fmt.Println(pS.Test[0])
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

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func indexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	parrot := aligner.Tester("hiswdy")
	fmt.Fprintf(w, "%s, this is sequentify, i am running on %s with an %s cpu", parrot, runtime.GOOS, runtime.GOARCH)
}

func main() {
	router := httprouter.New()
	router.GET("/", indexHandler)
	router.POST("/json", jsonHandler)
	router.OPTIONS("/*any", corsHandler)
	router.POST("/testpost", postHandler)
	router.POST("/align", alignHandler)
	http.ListenAndServe(":8080", router)
}
