package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	router.
		HandleFunc("/client1", client1Handler)
	router.
		HandleFunc("/client2", client2Handler)
	router.
		HandleFunc("/client1.js", js1Handler)
	router.
		HandleFunc("/client2.js", js2Handler)

	router.
		HandleFunc("/sendoffer", sendOffer).Methods("POST")
	router.
		HandleFunc("/sendanswer", sendAnswer).Methods("POST")

	router.
		HandleFunc("/getoffer", getOffer).Methods("GET")
	router.
		HandleFunc("/getanswer", getAnswer).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	err := http.ListenAndServeTLS(fmt.Sprintf(":%s", port), "server.crt", "server.key", router)
	// err := http.ListenAndServe(fmt.Sprintf(":%s", port), router)

	if err != nil {
		fmt.Print(err)
	}
}

func client1Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client1.html")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}

func client2Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client2.html")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}

func js1Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client1.js")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}

func js2Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client2.js")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}
