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
		HandleFunc("/sendoffer", SendOffer).Methods("POST")
	router.
		HandleFunc("/sendanswer", SendAnswer).Methods("POST")

	router.
		HandleFunc("/getoffer", GetOffer).Methods("GET")
	router.
		HandleFunc("/getanswer", GetAnswer).Methods("GET")

	router.
		HandleFunc("/client3", client3Handler)
	router.
		HandleFunc("/client3.js", js3Handler)
	router.
		HandleFunc("/client4", client4Handler)
	router.
		HandleFunc("/client4.js", js4Handler)

	router.
		HandleFunc("/client5", client5Handler)
	router.
		HandleFunc("/client5.js", js5Handler)
	router.
		HandleFunc("/client6", client6Handler)
	router.
		HandleFunc("/client6.js", js6Handler)

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

func client3Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client3.html")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}

func client4Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client4.html")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}

func client5Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client5.html")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}

func client6Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client6.html")
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

func js3Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client3.js")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}

func js4Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client4.js")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}

func js5Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client5.js")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}

func js6Handler(w http.ResponseWriter, r *http.Request) {
	path := fmt.Sprintf("client6.js")
	fmt.Println(path)
	http.ServeFile(w, r, path)
}
