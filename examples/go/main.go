package main

import (
	"fmt"
	"log"
	"net/http"
	"database/sql"
	"time"
	"os"

	"github.com/pseidemann/finish"
	_ "github.com/lib/pq"
)

func main() {

	db, err := sql.Open("postgres", fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s sslmode=%s port=%d",
		"postgres", "postgres", "postgres", os.Getenv("DB_HOSTNAME"), "disable", 5432),
	)
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(15 * time.Second)
		fmt.Printf("Hello Graceful\n")
		fmt.Fprintln(w, "world")
	})

	http.HandleFunc("/probes/readiness", func(res http.ResponseWriter, req *http.Request) {
		if err := db.PingContext(req.Context()); err != nil {
			res.WriteHeader(503)
		}
		fmt.Printf("Hello Database\n")
	})

	srv := &http.Server{Addr: "localhost:8080"}

	//fin := finish.New()
	//fin := &finish.Finisher{Timeout: time.Duration(30) * time.Second}
	fin := &finish.Finisher{Timeout: 30 * time.Second}
	//fin := &finish.Finisher{time.Sleep(2 * time.Second)}
	fin.Add(srv)

	go func() {
		err := srv.ListenAndServe()
		if err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	fin.Wait()
}
