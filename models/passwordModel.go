package models

import (
	"bufio"
	"fmt"
	"go-pass-react/controlers/password"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/google/uuid"
)

var reader = bufio.NewReader(os.Stdin)

type PasswordEntry struct {
	id       string
	title    string
	url      string
	username string
	password string
}

func (p *PasswordEntry) setTitle() error {
	fmt.Print("Titel eingeben: ")
	title, err := reader.ReadString('\n')
	if err != nil {
		return err
	}
	title = strings.TrimSpace(title)
	p.title = title
	return nil
}

func (p *PasswordEntry) setURL() error {
	fmt.Print("URL eingeben: ")
	url, err := reader.ReadString('\n')
	if err != nil {
		return err
	}
	url = strings.TrimSpace(url)
	p.url = url
	return nil
}

func (p *PasswordEntry) setUsername() error {
	fmt.Print("Benutzername eingeben: ")
	username, err := reader.ReadString('\n')
	if err != nil {
		return err
	}
	username = strings.TrimSpace(username)
	p.username = username
	return nil
}

func (p *PasswordEntry) setPassword() error {
	fmt.Println("1. Passwort Eingabe\n2. Passwort Generieren lassen")
	fmt.Print("Auswahl: ")
	input, err := reader.ReadString('\n')
	if err != nil {
		return err
	}
	input = strings.TrimSpace(input)
	convertedInput, err := strconv.Atoi(input)
	if err != nil {
		return err
	}
	switch convertedInput {
	case 1:
		fmt.Print("Passwort eingeben: ")
		pwd, err := reader.ReadString('\n')
		if err != nil {
			return err
		}
		pwd = strings.TrimSpace(pwd)
		p.password, err = password.EncryptAES(pwd)
		if err != nil {
			return err
		}
	case 2:
		pwd, err := password.GeneratePassword()
		if err != nil {
			return err
		}
		p.password, err = password.EncryptAES(pwd)
		if err != nil {
			return err
		}
	}
	return nil
}

func (p *PasswordEntry) newID() {
	id := uuid.New()
	p.id = id.String()
}

func (p *PasswordEntry) Create() error {
	if err := p.setTitle(); err != nil {
		return err
	}
	if err := p.setURL(); err != nil {
		return err
	}
	if err := p.setUsername(); err != nil {
		return err
	}
	if err := p.setPassword(); err != nil {
		return err
	}
	p.newID()
	return nil
}

func (p *PasswordEntry) Save(entries *[]PasswordEntry) {
	// TODO implement saving to file
	*entries = append(*entries, *p)
	fmt.Println("Passwort wurde gespeichert")
}

func (p *PasswordEntry) PrintEntry() {
	fmt.Printf("\n%-20s %s\n", "ID:", p.id)
	fmt.Printf("%-20s %s\n", "Titel:", p.title)
	fmt.Printf("%-20s %s\n", "URL:", p.url)
	fmt.Printf("%-20s %s\n", "Benutzername:", p.username)
	fmt.Printf("%-20s %s\n", "Passwort:", p.password)

	// Decrypt the password
	clearPwd, err := password.DecryptAES(p.password)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%-20s %s\n\n", "Clear Text Password:", clearPwd)
	fmt.Printf("--------------------------------------------------\n")

}
