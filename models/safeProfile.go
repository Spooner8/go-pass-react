package models

import (
	"encoding/json"
	"fmt"
	"go-pass-react/controllers/passwordHelpers"
	"os"

	"github.com/google/uuid"
)

type SafeProfile struct {
	Id             string          `json:"id"`
	Name           string          `json:"name"`
	FilePath       string          `json:"filepath"`
	Masterpassword string          `json:"masterpassword"`
	Passwords      []PasswordEntry `json:"passwords"`
	CreatedAt      string          `json:"createdAt"`
}

func (p *SafeProfile) Create() string {
	p.Id = generateNewID()
	hashedPassword, err := passwordHelpers.HashPassword(p.Masterpassword)
	if err != nil {
		return fmt.Sprintf("error: %s", err.Error())
	}
	p.Masterpassword = hashedPassword

	jsonData, err := json.Marshal(p)
	if err != nil {
		return fmt.Sprintf("error while marshal: %s", err.Error())
	}
	
	file, err := os.OpenFile(p.FilePath, os.O_RDWR|os.O_CREATE|os.O_EXCL, 0644)
	if err != nil {
		if os.IsExist(err) {
			return "error: Datei mit diesem Namen existiert bereits!"
		}
		return fmt.Sprintf("error while open: %s", err.Error())
	}
	defer file.Close()

	_, err = file.Write(jsonData)
	if err != nil {
		return fmt.Sprintf("error while writing: %s", err.Error())
	}

	return "created"
}

func (p *SafeProfile) Update() string {
	checkNewEntries(&p.Passwords)

	jsonData, err := json.Marshal(p)
	if err != nil {
		return fmt.Sprintf("error: %s", err.Error())
	}

	file, err := os.OpenFile(p.FilePath, os.O_RDWR, 0644)
	if err != nil {
		return fmt.Sprintf("error: %s", err.Error())
	}
	defer file.Close()

	_, err = file.Write(jsonData)
	if err != nil {
		return fmt.Sprintf("error: %s", err.Error())
	}

	return "updated"
}

func checkNewEntries(entries *[]PasswordEntry) {
	for i := range *entries {
		if (*entries)[i].Id == "" {
			(*entries)[i].Id = generateNewID()
		}
	}
}

func generateNewID() string {
	return uuid.New().String()
}