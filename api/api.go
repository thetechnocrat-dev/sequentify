package main

import (
	"github.com/McMenemy/sequentify/api/routes"
	"github.com/McMenemy/sequentify/api/services/database"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
)

func main() {
	router := httprouter.New()
	router.GET("/", routes.IndexHandler)
	router.OPTIONS("/*any", routes.CorsHandler)
	router.POST("/align", routes.AlignHandler)

	_, err := database.Init()
	if err != nil {
		log.Println("connection to DB failed, aborting...")
		log.Fatal(err)
	}

	log.Println("connected to DB")
	http.ListenAndServe(":8080", router)
}
