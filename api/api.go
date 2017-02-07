package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/McMenemy/sequentify/api/aligner"
	"github.com/julienschmidt/httprouter"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"os"
	"time"
)

var db *sql.DB
var err error

func getFrontendUrl() string {
	if os.Getenv("APP_ENV") == "production" {
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
	frontendUrl := getFrontendUrl()
	w.Header().Set("Access-Control-Allow-Origin", frontendUrl)
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
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
		panic(err)
	}

	alignment := aligner.Align(alignData.SeqA, alignData.SeqB, alignData.MatchScore,
		alignData.MismatchPenalty, alignData.GapPenalty, alignData.GapOpeningPenalty)
	res, err := json.Marshal(alignment)
	if err != nil {
		panic(err)
	}

	w.Write(res)
}

func alignSearchHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	frontendUrl := getFrontendUrl()
	w.Header().Set("Access-Control-Allow-Origin", frontendUrl)
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
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
		panic(err)
	}

	alignments := aligner.AlignSearch(alignSearchData.TargetSeq, alignSearchData.Sequences,
		alignSearchData.MatchScore, alignSearchData.MismatchPenalty, alignSearchData.GapPenalty,
		alignSearchData.GapOpeningPenalty)
	res, err := json.Marshal(alignments)
	if err != nil {
		panic(err)
	}

	w.Write(res)
}

func indexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	log.Println("index handle")
	err = db.Ping()
	log.Println("index handle")
	if err != nil {
		log.Println("no DB connection")
		log.Println(err)
	}
	_, err = db.Exec(
		`create table if not exists appusers (
			id serial primary key,
			username text not null,
			password text not null
		)`)
	if err != nil {
		log.Fatal(err)
	}
	query :=
		`INSERT INTO
			appusers ("username","password")
		VALUES
			($1, $2)
		RETURNING
			id`
	if err != nil {
		log.Fatal(err)
	}
	var studentID int
	stmt, err := db.Prepare(query)
	err = stmt.QueryRow("Lee", "testing").Scan(&studentID)
	if err != nil {
		log.Println(err)
		fmt.Fprintf(w, "This is sequentify's resful API - db query failed")
	}
	log.Println(studentID)
	fmt.Fprintf(w, "This a is sequentify's resftful API: %s", studentID)
}

func main() {
	router := httprouter.New()
	router.GET("/", indexHandler)
	router.OPTIONS("/*any", corsHandler)
	router.POST("/align", alignHandler)

	// set up DB connection and then attempt to connect 5 times over 25 seconds
	db, err = sql.Open("postgres", "user=docker password=docker dbname=sample sslmode=disable host=db")
	if err != nil {
		log.Fatal(err)
	}
	for i := 0; i < 5; i++ {
		log.Println(i)
		err = db.Ping()
		if err == nil {
			break
		}
		time.Sleep(5 * time.Second)
	}

	log.Println("connected to DB")
	http.ListenAndServe(":8080", router)
}
