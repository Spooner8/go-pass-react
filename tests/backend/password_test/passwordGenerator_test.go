package password_test

import (
	"go-pass-react/controllers/passwordHelpers"
	"testing"
)

func TestGeneratePassword(t *testing.T) {
	pwd, err := passwordHelpers.GeneratePassword()
	if err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}

	if len(pwd) == 0 {
		t.Errorf("Expected a generated password, got an empty string")
	}

	t.Logf("Generated password: %s", pwd)
}
