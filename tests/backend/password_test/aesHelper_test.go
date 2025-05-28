// Package password_test provides some tests for the passwordHelpers package
package password_test

import (
    "go-pass-react/controllers/passwordHelpers"
    "os"
    "testing"
)

func TestEncryptAESBytes(t *testing.T) {
    _ = os.Setenv("SECRET_KEY", "0123456789abcdef") // 16 bytes for AES-128

    data := []byte("mysecretdata")
    encrypted, err := passwordHelpers.EncryptAESBytes(data)
    if err != nil {
        t.Fatalf("Expected no error, got: %v", err)
    }

    if len(encrypted) == 0 {
        t.Fatalf("Expected encrypted data, got empty slice")
    }

    t.Logf("Original data: %s", data)
    t.Logf("Encrypted data: %x", encrypted)
}

func TestDecryptAESBytes(t *testing.T) {
    _ = os.Setenv("SECRET_KEY", "0123456789abcdef") // 16 bytes for AES-128

    data := []byte("mysecretdata")
    encrypted, err := passwordHelpers.EncryptAESBytes(data)
    if err != nil {
        t.Fatalf("Expected no error, got: %v", err)
    }

    decrypted, err := passwordHelpers.DecryptAESBytes(encrypted)
    if err != nil {
        t.Fatalf("Expected no error, got: %v", err)
    }

    if string(decrypted) != string(data) {
        t.Fatalf("Expected decrypted data to be %s, got %s", data, decrypted)
    }

    t.Logf("Original data: %s", data)
    t.Logf("Encrypted data: %x", encrypted)
    t.Logf("Decrypted data: %s", decrypted)
}