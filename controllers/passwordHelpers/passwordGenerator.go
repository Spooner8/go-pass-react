package passwordHelpers

import (
	"crypto/aes"
	"crypto/cipher"
	"fmt"
	"go.tmthrgd.dev/passit"
	"log"
	"os"
)

// GeneratePassword generates a password using the passit package and aes encryption.
// It uses the SECRET_KEY environment variable as the encryption key.
// It returns the generated password or an error.
func GeneratePassword() (string, error) {
	secretKey := []byte(os.Getenv("SECRET_KEY"))
	if len(secretKey) == 0 {
		return "", fmt.Errorf("no secret key found in environment variables")
	}

	block, err := aes.NewCipher(secretKey)
	if err != nil {
		return "", fmt.Errorf("error creating cipher block: %v", err)
	}

	initialVector := make([]byte, aes.BlockSize)

	cipherStream := cipher.NewCTR(block, initialVector)
	streamReader := cipher.StreamReader{S: cipherStream, R: zeroReader{}}

	pwd, err := passit.Repeat(passit.EFFLargeWordlist, "-", 6).Password(streamReader)
	if err != nil {
		log.Fatal("error while generating password_test", err)
		return "", err
	}
	return pwd, nil
}

type zeroReader struct{}

// Read implements the io.Reader interface.
func (zeroReader) Read(p []byte) (int, error) {
	clear(p)
	return len(p), nil
}
