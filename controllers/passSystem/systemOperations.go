// Package system provides some function to interact from Frontend to Backend for system operations
package passSystem

import (
	"github.com/sqweek/dialog"
)

// selectDir gives you a dialog to select a directory
// It returns the selected directory or an empty string if the user cancels the dialog
func SelectDir() string {
	filePath, err := dialog.Directory().Title("Speicheroft auswählen").Browse()
	if err != nil {
		return ""
	}
	return filePath
}

// SelectFile gives you a dialog to select a file
// It returns the selected file or an empty string if the user cancels the dialog
func SelectFile() string {
	filePath, err := dialog.File().Title("Datei auswählen").Filter("GOPASS-Dateien", "gopass").Load()
	if err != nil {
		return ""
	}
	return filePath
}