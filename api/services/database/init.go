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

func addTables() error {
	_, err = DB.Exec(
		`create table if not exists sequences (
			id int primary key,
			seqStoreId int foreign key,
			name char(50) not null,
			sequence text not null
		)`)
	if err != nil {
		return err
	}

	_, err = DB.Exec(
		`create table if not exists seqStores (
			id int primary key,
			name char(50) not null
		)`)
	if err != nil {
		return err
	}

	return nil
}

func addSeqStore(name string) error {
	_, err = DB.Exec(
		`INSET INTO
			seqStores ("name")
		VALUES
			($1)`,
		name
	)
	if err != nil {
		return err
	}

	return nil
}

func addSequence(seqStoreId int, name, sequence string) error {
	_, err = DB.Exec(
		`INSERT INTO
			sequences ("seqStoreId","name","sequence")
		VALUES
			($1, $2, $3)`,
		seqStoreId, name, sequence
	)
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

	err = addSeqStore("testing")
	if err != nil {
		return DB, err
	}

	err = addSequence(

	return DB, err
}
