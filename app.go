package main

import (
	"context"
	"encoding/json"
	"fmt"
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

func (a *App) SetEnv(key, value string) {
	os.Setenv(key, value)
}
func (a *App) CreateProfile(profile json.RawMessage) string {
	return safeProfile.CreateSafeProfile(profile)
}

func (a *App) SelectDir() string {
	return passSystem.SelectDir()
}
