package models

import (
	"fmt"
	"github.com/google/uuid"
)

type PasswordEntry struct {
	Id        string `json:"id"`
	Title     string `json:"title"`
	Url       string `json:"url"`
	Username  string `json:"username"`
	Password  string `json:"password"`
	Notes     string `json:"notes"`
	CreatedAt string `json:"createdAt"`
}

func (p *PasswordEntry) newID() {
	id := uuid.New()
	p.Id = id.String()
}

func (p *PasswordEntry) Save() {
	if p.Id == "" {
		p.newID()
	}
	// TODO implement saving to file
	fmt.Println("Passwort wurde gespeichert")
}
