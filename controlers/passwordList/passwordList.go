package passwordList

import (
	"fmt"
	"go-pass-react/models"
)

func GetPasswords(entries *[]models.PasswordEntry) {
	fmt.Println("Alle Passwörter anzeigen")
	for _, entry := range *entries {
		entry.PrintEntry()
	}
}
