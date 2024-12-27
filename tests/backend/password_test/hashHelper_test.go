package password_test

import (
	"go-pass-react/controllers/passwordHelpers"
	"testing"
)

// TestHashPassword tests the HashPassword function basic functionality by hashing a password and checking if the hashed password is not empty
func TestHashPassword(t *testing.T) {
	pwd := "mysecretpassword"
	hashedPassword, err := passwordHelpers.HashPassword(pwd)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(hashedPassword) == 0 {
		t.Fatalf("Expected a hashed password, got an empty string")
	}

	t.Logf("Hashed password: %s", hashedPassword)
}

// TestVerifyPassword tests the VerifyPassword function basic functionality by hashing a password and then verifying it
func TestVerifyPassword(t *testing.T) {
	pwd := "mysecretpassword"
	hashedPassword, err := passwordHelpers.HashPassword(pwd)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	verified := passwordHelpers.VerifyPassword(hashedPassword, pwd)

	if !verified {
		t.Fatalf("Expected password to be verified, but it was not")
	}

	t.Logf("password verified: %v", verified)
}
