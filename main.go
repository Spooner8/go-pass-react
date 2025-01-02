package main

import (
	"embed"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/labstack/gommon/log"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

    err := godotenv.Load()
    if err != nil {
        log.Warn("No .env file found, using embedded environment variables")
        
        envData, err := Asset(".env")
        if err != nil {
            log.Fatal("Error loading embedded .env file")
        }

        envLines := strings.Split(string(envData), "\n")
        for _, line := range envLines {
            if line == "" || strings.HasPrefix(line, "#") {
                continue
            }
            parts := strings.SplitN(line, "=", 2)
            if len(parts) != 2 {
                continue
            }
            os.Setenv(parts[0], parts[1])
        }
    }

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "Go Pass",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
