package main

import (
	"encoding/json"
	"net/http"
)

var offer Session
var answer Session

type Session struct {
	SDP  string `json:"sdp"`
	Type string `json:"type"`
}

func Respond(w http.ResponseWriter, data map[string]interface{}) {
	/*This is for response*/
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func Message(status bool, message string) map[string]interface{} {
	return map[string]interface{}{"status": status, "message": message}
}

var sendOffer = func(w http.ResponseWriter, r *http.Request) {
	session := Session{}
	err := json.NewDecoder(r.Body).Decode(&session)

	defer r.Body.Close()

	if err != nil {
		Respond(w, Message(false, "Invalid request"))
		return
	}

	// response
	offer = session
	resp := Message(true, "Send offer successfully !!!")
	Respond(w, resp)
	return
}

var sendAnswer = func(w http.ResponseWriter, r *http.Request) {
	session := Session{}
	err := json.NewDecoder(r.Body).Decode(&session)

	defer r.Body.Close()

	if err != nil {
		Respond(w, Message(false, "Invalid request"))
		return
	}

	// response
	answer = session
	resp := Message(true, "Send answer successfully !!!")
	Respond(w, resp)
	return
}

var getOffer = func(w http.ResponseWriter, r *http.Request) {
	// response
	resp := Message(true, "get offer successfully !!!")
	resp["offer"] = offer
	Respond(w, resp)
	return
}

var getAnswer = func(w http.ResponseWriter, r *http.Request) {
	// response
	resp := Message(true, "get answer successfully !!!")
	resp["answer"] = answer
	Respond(w, resp)
	return
}
