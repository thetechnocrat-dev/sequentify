package database

import (
	"database/sql"
	_ "github.com/lib/pq"
	"time"
)

var DB *sql.DB
var err error

func addDatabase(dbname string) error {
	// create database with dbname, won't do anything if db already exists
	DB.Exec("CREATE DATABASE " + dbname)

	// connect to newly created DB (now has dbname param)
	connectionParams := "dbname=" + dbname + " user=docker password=docker sslmode=disable host=db"
	DB, err = sql.Open("postgres", connectionParams)
	if err != nil {
		return err
	}

	return nil
}

func addUserTable() error {
	_, err = DB.Exec(
		`create table if not exists appusers (
			id serial primary key,
			username text not null,
			password text not null
		)`)
	if err != nil {
		return err
	}

	return nil
}

func Init() (*sql.DB, error) {
	// set up DB connection and then attempt to connect 5 times over 25 seconds
	connectionParams := "user=docker password=docker sslmode=disable host=db"
	DB, err = sql.Open("postgres", connectionParams)
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

	err = addDatabase("sequentify")
	if err != nil {
		return DB, err
	}

	err = addUserTable()
	if err != nil {
		return DB, err
	}

	return DB, err
}
