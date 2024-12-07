// Package password provides functions to handle password in several ways.
// It generates a password using the passit package and aes encryption.
// It hashes the password using bcrypt. (For the Master password)
// It encrypts and decrypts the password using AES. (For the stored passwords)
package password

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"os"
)

// EncryptAES encrypts a given password with AES.
// It uses the SECRET_KEY environment variable as the encryption key.
// It returns the encrypted password or an error.
func EncryptAES(password string) (string, error) {
	secretKey := []byte(os.Getenv("SECRET_KEY"))
	if len(secretKey) == 0 {
		return "", fmt.Errorf("no secret key found in environment variables")
	}

	block, err := aes.NewCipher(secretKey)
	if err != nil {
		return "", fmt.Errorf("error creating cipher block: %v", err)
	}

	ciphertext := make([]byte, aes.BlockSize+len(password))
	initialVector := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, initialVector); err != nil {
		return "", fmt.Errorf("error generating IV: %v", err)
	}

	stream := cipher.NewCFBEncrypter(block, initialVector)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(password))

	return hex.EncodeToString(ciphertext), nil
}

// DecryptAES decrypt a given password with AES.
// It uses the SECRET_KEY environment variable as the encryption key.
// It returns the decrypted password or an error.
func DecryptAES(encryptedPassword string) (string, error) {
	secretKey := []byte(os.Getenv("SECRET_KEY"))
	if len(secretKey) == 0 {
		return "", fmt.Errorf("no secret key found in environment variables")
	}

	ciphertext, err := hex.DecodeString(encryptedPassword)
	if err != nil {
		return "", fmt.Errorf("error decoding encrypted password_test: %v", err)
	}

	block, err := aes.NewCipher(secretKey)
	if err != nil {
		return "", fmt.Errorf("error creating cipher block: %v", err)
	}

	if len(ciphertext) < aes.BlockSize {
		return "", fmt.Errorf("ciphertext too short")
	}

	initialVector := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, initialVector)
	stream.XORKeyStream(ciphertext, ciphertext)

	return string(ciphertext), nil
}
