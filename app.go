package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go-pass-react/controllers/passwordHelpers"
	"go-pass-react/controllers/passSystem"
	"go-pass-react/controllers/safeProfile"
	"os"
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

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetEnv(key string) string {
	return os.Getenv(key)
}

func (a *App) CreateProfile(profile json.RawMessage) string {
	return safeProfile.CreateSafeProfile(profile)
}

func (a *App) UpdateProfile(profile json.RawMessage) string {
	return safeProfile.UpdateSafeProfile(profile)
}

func (a *App) GetProfile() (json.RawMessage, error) {
	return safeProfile.GetSafeProfile()
}

func (a *App) GetProfileFromPath(filePath string) (json.RawMessage, error) {
	return safeProfile.GetSafeProfileFromPath(filePath)
}

func (a *App) SelectDir() string {
	return passSystem.SelectDir()
}

func (a *App) VerifyPassword(hashedPassword, password string) bool {
	return passwordHelpers.VerifyPassword(hashedPassword, password)
}
