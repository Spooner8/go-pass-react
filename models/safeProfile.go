package models

import (
	"encoding/json"
	"fmt"
	"os"
)

type SafeProfile struct {
	Id             string          `json:"id"`
	Name           string          `json:"name"`
	FilePath       string          `json:"path"`
	Masterpassword string          `json:"masterpassword"`
	Passwords      []PasswordEntry `json:"passwords"`
	CreatedAt      string          `json:"createdAt"`
}

func (p *SafeProfile) Create(safeProfile SafeProfile) string {
	jsonData, err := json.Marshal(safeProfile)
	if err != nil {
		return fmt.Sprintf("Error: %s", err.Error())
	}

	file, err := os.OpenFile(safeProfile.FilePath, os.O_RDWR|os.O_CREATE|os.O_EXCL, 0644)
	if err != nil {
		if os.IsExist(err) {
			return "Error: Datei mit diesem Namen existiert bereits!"
		}
		return fmt.Sprintf("Error: %s", err.Error())
	}
	defer file.Close()

	_, err = file.Write(jsonData)
	if err != nil {
		return fmt.Sprintf("Error: %s", err.Error())
	}

	return "created"
}

func (p *SafeProfile) Get() (SafeProfile, error) {
	file, err := os.Open(p.FilePath)
	if err != nil {
		return SafeProfile{}, err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	safeProfile := SafeProfile{}
	err = decoder.Decode(&safeProfile)
	if err != nil {
		return SafeProfile{}, err
	}

	return safeProfile, nil
}

func (p *SafeProfile) Update(safeProfile SafeProfile) string {
	jsonData, err := json.Marshal(safeProfile)
	if err != nil {
		return fmt.Sprintf("Error: %s", err.Error())
	}

	file, err := os.OpenFile(safeProfile.FilePath, os.O_RDWR, 0644)
	if err != nil {
		return fmt.Sprintf("Error: %s", err.Error())
	}
	defer file.Close()

	_, err = file.Write(jsonData)
	if err != nil {
		return fmt.Sprintf("Error: %s", err.Error())
	}

	return "updated"
}
