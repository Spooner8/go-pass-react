// Package system provides some function to interact from Frontend to Backend for system operations
package passSystem

import (
	"github.com/sqweek/dialog"
)

// selectDir is a function to select a folder from the system
func SelectDir() string {
	filePath, err := dialog.Directory().Title("Speicheroft auswählen").Browse()
	if err != nil {
		return ""
	}
	return filePath
}