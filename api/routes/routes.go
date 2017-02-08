import (
	"encoding/json"
	"fmt"
	"github.com/McMenemy/sequentify/api/services/aligner"
	"github.com/McMenemy/sequentify/api/services/database"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
)

type AlignSearchData struct {
	TargetSeq         string
	Sequences         [][]string
	MatchScore        float64
	MismatchPenalty   float64
	GapPenalty        float64
	GapOpeningPenalty float64
}

type AlignData struct {
	SeqA              string
	SeqB              string
	MatchScore        float64
	MismatchPenalty   float64
	GapPenalty        float64
	GapOpeningPenalty float64
}

func CorsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
}

func AlignHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
	w.Header().Set("Content-Type", "application/json")

	decoder := json.NewDecoder(r.Body)
	var alignData AlignData
	err := decoder.Decode(&alignData)
	if err != nil {
		sendErrorResponse(w, err.Error(), 400)
		return
	}

	alignment := aligner.Align(alignData.SeqA, alignData.SeqB, alignData.MatchScore,
		alignData.MismatchPenalty, alignData.GapPenalty, alignData.GapOpeningPenalty)
	res, err := json.Marshal(alignment)
	if err != nil {
		sendErrorResponse(w, err.Error(), 500)
		return
	}

	w.Write(res)
}

func AlignSearchHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
	w.Header().Set("Content-Type", "application/json")

	decoder := json.NewDecoder(r.Body)
	var alignSearchData AlignSearchData
	err := decoder.Decode(&alignSearchData)
	if err != nil {
		sendErrorResponse(w, err.Error(), 400)
		return
	}

	alignments := aligner.AlignSearch(alignSearchData.TargetSeq, alignSearchData.Sequences,
		alignSearchData.MatchScore, alignSearchData.MismatchPenalty, alignSearchData.GapPenalty,
		alignSearchData.GapOpeningPenalty)
	res, err := json.Marshal(alignments)
	if err != nil {
		sendErrorResponse(w, err.Error(), 500)
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
