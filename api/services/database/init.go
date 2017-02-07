package database

import (
	"database/sql"
	_ "github.com/lib/pq"
	"time"
)

var DB *sql.DB
var err error

func Init() (*sql.DB, error) {
	// set up DB connection and then attempt to connect 5 times over 25 seconds
	DB, err = sql.Open("postgres", "user=docker password=docker dbname=sample sslmode=disable host=db")
	if err != nil {
		return DB, err
	}

	for i := 0; i < 5; i++ {
		err = DB.Ping()
		if err == nil {
			break
		}
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		return DB, err
	}

	return DB, err
}
