// Package password_test provides some tests for the passwordHelpers package
package password_test

import (
	"go-pass-react/controllers/passwordHelpers"
	"testing"
)

// TestHashPassword tests the HashPassword function basic functionality
func TestEncryptAES(t *testing.T) {
	pwd := "mysecretpassword"
	encryptedPassword, err := passwordHelpers.EncryptAES(pwd)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(encryptedPassword) == 0 {
		t.Fatalf("Expected an encrypted password, got an empty string")
	}

	t.Logf("password to encrypt %s:", pwd)
	t.Logf("Encrypted password: %s", encryptedPassword)
}

// TestDecryptAES tests the DecryptAES function basic functionality by encrypting a password and then decrypting it
func TestDecryptAES(t *testing.T) {
	pwd := "mysecretpassword"
	encryptedPassword, err := passwordHelpers.EncryptAES(pwd)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	decryptedPassword, err := passwordHelpers.DecryptAES(encryptedPassword)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if decryptedPassword != pwd {
		t.Fatalf("Expected decrypted password to be %s, got %s", pwd, decryptedPassword)
	}

	t.Logf("password: %s", pwd)
	t.Logf("Encrypted password: %s", encryptedPassword)
	t.Logf("Decrypted password: %s", decryptedPassword)
}
