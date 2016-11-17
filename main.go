package main

import (
	"encoding/json"
	"fmt"
	"github.com/McMenemy/aligner"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"runtime"
)

func jsonHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	type Example struct {
		Pairs []string
	}
	e := Example{
		Pairs: []string{"gg", "g_", "__", "tt"},
	}
	res, err := json.Marshal(e)
	if err != nil {
		fmt.Println("error:", err)
	}
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
	router.GET("/json", jsonHandler)
	http.ListenAndServe(":8080", router)
}
