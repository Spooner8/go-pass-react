// Package main provides the main application logic for the go-pass-react application
// It containes all the methods that are callable from the frontend
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go-pass-react/controllers/passSystem"
	"go-pass-react/controllers/passwordHelpers"
	"go-pass-react/controllers/safeProfile"
	"os"
	"github.com/atotto/clipboard"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Quit() {
	a.ctx.Done()
}

// GetEnv returns the value of an environment variable by key
func (a *App) GetEnv(key string) string {
	return os.Getenv(key)
}

// CreateProfile creates a new profile by calling the safeProfile package
// It returns a string with the result of the operation
func (a *App) CreateProfile(profile json.RawMessage) string {
	return safeProfile.CreateSafeProfile(profile)
}

// UpdateProfile updates the profile by calling the safeProfile package
// It returns a string with the result of the operation
func (a *App) UpdateProfile(profile json.RawMessage) string {
	return safeProfile.UpdateSafeProfile(profile)
}

// GetProfile opens a dialog to select a filepath
// It returns the profile as json or an error
func (a *App) GetProfile() (json.RawMessage, error) {
	return safeProfile.GetSafeProfile()
}

// GetProfileFromPath gets the profile from a given filepath
// It returns the profile as json or an error
func (a *App) GetProfileFromPath(filePath string) (json.RawMessage, error) {
	return safeProfile.GetSafeProfileFromPath(filePath)
}

// GenerateNewPassword generates a new password by calling the passwordHelpers package
// It returns the generated password or an error
func (a *App) GenerateNewPassword() (string, error) {
	return passwordHelpers.GeneratePassword()
}

// SelectDir gives you a dialog to select a directory
// It returns the selected directory or an empty string if the user cancels the dialog
func (a *App) SelectDir() string {
	return passSystem.SelectDir()
}

// VerifyPassword verifies the masterpassword by calling the passwordHelpers package
// It returns true if the given password matches the hashed password by hashing and comparing it
func (a *App) VerifyPassword(hashedPassword, password string) bool {
	return passwordHelpers.VerifyPassword(hashedPassword, password)
}

// AddToClipboard adds a password to the clipboard for a predefined time
// It returns an error if the password could not be copied to the clipboard
// or nil if the operation was successful
func (a *App) AddToClipboard(password string) (error) {
	err := clipboard.WriteAll(password)
	if err != nil {
		return fmt.Errorf("error copying password to clipboard: %v", err)
	}
	return nil
}
