package password_test

import (
	"go-pass-react/controlers/password"
	"testing"
)

func TestEncryptAES(t *testing.T) {
	pwd := "mysecretpassword"
	encryptedPassword, err := password.EncryptAES(pwd)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(encryptedPassword) == 0 {
		t.Fatalf("Expected an encrypted password, got an empty string")
	}

	t.Logf("password to encrypt %s:", pwd)
	t.Logf("Encrypted password: %s", encryptedPassword)
}

func TestDecryptAES(t *testing.T) {
	pwd := "mysecretpassword"
	encryptedPassword, err := password.EncryptAES(pwd)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	decryptedPassword, err := password.DecryptAES(encryptedPassword)
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
