package password_test

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"testing"
)

var originalSecretKey string

func TestMain(m *testing.M) {
	fmt.Println("Setting up the test suite...")
	originalSecretKey = os.Getenv("SECRET_KEY")

	err := os.Setenv("SECRET_KEY", generate32byteKey())
	if err != nil {
		fmt.Printf("Error while setting the secret key: %v", err)
		os.Exit(1)
	}
	fmt.Println("Running the tests...")
	code := m.Run()

	fmt.Println("Tearing down the test suite...")
	err = os.Setenv("SECRET_KEY", originalSecretKey)
	if err != nil {
		log.Fatalf("Error while restoring the secret key: %v", err)
	}

	fmt.Println("Tests finished!")
	os.Exit(code)
}

func generate32byteKey() string {
	key := make([]byte, 16)
	_, err := rand.Read(key)
	if err != nil {
		log.Fatalf("Error while generating the key: %v", err)
	}

	return hex.EncodeToString(key)
}
