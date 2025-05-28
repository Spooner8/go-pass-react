// Package models provides the struct for the safeProfile and some functions to interact with it
package models

import (
	"encoding/json"
	"fmt"
	"go-pass-react/controllers/passwordHelpers"
	"os"

	"github.com/google/uuid"
)

// SafeProfile is the struct for the safeProfile
// It contains the Passwords as a slice of PasswordEntry
type SafeProfile struct {
	Id             string          `json:"id"`
	Name           string          `json:"name"`
	FilePath       string          `json:"filepath"`
	Masterpassword string          `json:"masterpassword"`
	Passwords      []PasswordEntry `json:"passwords"`
	CreatedAt      string          `json:"createdAt"`
	UpdatedAt      string          `json:"updatedAt"`
}

// Create creates a new safeProfile by marshaling the struct to json and writing it to a file
// On creation the masterpassword will be hashed with bcrypt and the id will be generated
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

	encryptedData, err := passwordHelpers.EncryptAESBytes(jsonData)
    if err != nil {
        return fmt.Sprintf("error while encrypt: %s", err.Error())
    }
	
	file, err := os.OpenFile(p.FilePath, os.O_RDWR|os.O_CREATE|os.O_EXCL, 0644)
	if err != nil {
		if os.IsExist(err) {
			return "error: Datei mit diesem Namen existiert bereits!"
		}
		return fmt.Sprintf("error while open: %s", err.Error())
	}
	defer file.Close()

	_, err = file.Write(encryptedData)
	if err != nil {
		return fmt.Sprintf("error while writing: %s", err.Error())
	}

	return "created"
}

// Update updates the safeProfile by marshaling the struct to json and writing it to a file
// It also checks if the PasswordEntries have an id and generates one if not
func (p *SafeProfile) Update() string {
    checkNewEntries(&p.Passwords)

    jsonData, err := json.Marshal(p)
    if err != nil {
        return fmt.Sprintf("error: %s", err.Error())
    }

	encryptedData, err := passwordHelpers.EncryptAESBytes(jsonData)
    if err != nil {
        return fmt.Sprintf("error while encrypt: %s", err.Error())
    }

    file, err := os.OpenFile(p.FilePath, os.O_RDWR|os.O_TRUNC, 0644)
    if err != nil {
        return fmt.Sprintf("error: %s", err.Error())
    }
    defer file.Close()

    _, err = file.Write(encryptedData)
    if err != nil {
        return fmt.Sprintf("error: %s", err.Error())
    }

    return "updated"
}

// checkNewEntries checks if the PasswordEntries have an id and generates one if not
func checkNewEntries(entries *[]PasswordEntry) {
	for i := range *entries {
		if (*entries)[i].Id == "" {
			(*entries)[i].Id = generateNewID()
		}
	}
}

// generateNewID generates a new id with the uuid package
func generateNewID() string {
	return uuid.New().String()
}