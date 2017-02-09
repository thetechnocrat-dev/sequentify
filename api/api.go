package main

import (
	"github.com/McMenemy/sequentify/api/routes"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func main() {
	router := httprouter.New()
	router.GET("/", routes.IndexHandler)
	router.OPTIONS("/*any", routes.CorsHandler)
	router.POST("/align", routes.AlignHandler)
	router.POST("/alignSearch", routes.AlignSearchHandler)

	http.ListenAndServe(":8080", router)
}
