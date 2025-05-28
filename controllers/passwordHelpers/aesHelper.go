// Package password provides functions to handle password in several ways.
// It generates a password using the passit package and aes encryption.
// It hashes the password using bcrypt. (For the Master password)
// It encrypts and decrypts the password using AES. (For the stored passwords)
package passwordHelpers

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"fmt"
	"io"
	"os"
)

// EncryptAES encrypts a given password with AES.
// It uses the SECRET_KEY environment variable as the encryption key.
// It returns the encrypted password or an error.
func EncryptAESBytes(data []byte) ([]byte, error) {
    secretKey := []byte(os.Getenv("SECRET_KEY"))
    if len(secretKey) == 0 {
        return nil, fmt.Errorf("no secret key found in environment variables")
    }

    block, err := aes.NewCipher(secretKey)
    if err != nil {
        return nil, fmt.Errorf("error creating cipher block: %v", err)
    }

    ciphertext := make([]byte, aes.BlockSize+len(data))
    initialVector := ciphertext[:aes.BlockSize]
    if _, err := io.ReadFull(rand.Reader, initialVector); err != nil {
        return nil, fmt.Errorf("error generating IV: %v", err)
    }

    stream := cipher.NewCFBEncrypter(block, initialVector)
    stream.XORKeyStream(ciphertext[aes.BlockSize:], data)

    return ciphertext, nil
}

// DecryptAES decrypt a given password with AES.
// It uses the SECRET_KEY environment variable as the encryption key.
// It returns the decrypted password or an error.
func DecryptAESBytes(ciphertext []byte) ([]byte, error) {
    secretKey := []byte(os.Getenv("SECRET_KEY"))
    if len(secretKey) == 0 {
        return nil, fmt.Errorf("no secret key found in environment variables")
    }

    if len(ciphertext) < aes.BlockSize {
        return nil, fmt.Errorf("ciphertext too short")
    }

    block, err := aes.NewCipher(secretKey)
    if err != nil {
        return nil, fmt.Errorf("error creating cipher block: %v", err)
    }

    initialVector := ciphertext[:aes.BlockSize]
    ciphertext = ciphertext[aes.BlockSize:]

    stream := cipher.NewCFBDecrypter(block, initialVector)
    stream.XORKeyStream(ciphertext, ciphertext)

    return ciphertext, nil
}
