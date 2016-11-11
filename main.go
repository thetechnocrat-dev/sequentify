package main

import (
	"fmt"
	"github.com/McMenemy/aligner"
	"net/http"
	"runtime"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	parrot := aligner.Tester("howdy")
	fmt.Fprintf(w, "%s, this is sequentify, i am running on %s with an %s cpu", parrot, runtime.GOOS, runtime.GOARCH)
}

func main() {
	http.HandleFunc("/", indexHandler)
	http.ListenAndServe(":8080", nil)
}
