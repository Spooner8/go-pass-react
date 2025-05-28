// Package safeProfile provides some function to interact from Frontend to Backend for safeProfile operations
package safeProfile

import (
	"encoding/json"
	"fmt"
	"go-pass-react/controllers/passSystem"
	"go-pass-react/controllers/passwordHelpers"
	"go-pass-react/models"
	"os"
)

// CreateSafeProfile prooves if the given safeProfile is valid to the model and creates it
// It returns a string with the result of the operation
func CreateSafeProfile(safeProfile json.RawMessage) string {
	safeProfileStruct := models.SafeProfile{}
	err := json.Unmarshal(safeProfile, &safeProfileStruct)
	if err != nil {
		return fmt.Sprintf("error while unmarshal: %s", err.Error())
	}

	return safeProfileStruct.Create()
}

// GetSafeProfile opens a dialog to select a filepath
// It returns the safeProfile as json or an error
func GetSafeProfile() (json.RawMessage, error) {
    filePath := passSystem.SelectFile()
    if filePath == "" {
        return nil, fmt.Errorf("error: no file selected")
    }

	data, err := os.ReadFile(filePath)
    if err != nil {
        return nil, fmt.Errorf("error: %s", err.Error())
    }

    decryptedData, err := passwordHelpers.DecryptAESBytes(data)
    if err != nil {
        return nil, fmt.Errorf("error decrypting file: %s", err.Error())
    }

    safeProfileStruct := models.SafeProfile{}
    err = json.Unmarshal(decryptedData, &safeProfileStruct)
    if err != nil {
        return nil, fmt.Errorf("error: %s", err.Error())
    }

    return json.Marshal(safeProfileStruct)
}

// GetSafeProfileFromPath gets the safeProfile from a given filepath
// It returns the safeProfile as json or an error
func GetSafeProfileFromPath(filePath string) (json.RawMessage, error) {
    data, err := os.ReadFile(filePath)
    if err != nil {
        return nil, fmt.Errorf("error: %s", err.Error())
    }

    decryptedData, err := passwordHelpers.DecryptAESBytes(data)
    if err != nil {
        return nil, fmt.Errorf("error decrypting file: %s", err.Error())
    }

    safeProfileStruct := models.SafeProfile{}
    err = json.Unmarshal(decryptedData, &safeProfileStruct)
    if err != nil {
        return nil, fmt.Errorf("error: %s", err.Error())
    }

    return json.Marshal(safeProfileStruct)
}

// UpdateSafeProfile prooves if the given safeProfile is valid to the model and updates it
// It returns a string with the result of the operation
func UpdateSafeProfile(safeProfile json.RawMessage) string {
    safeProfileStruct := models.SafeProfile{}
    err := json.Unmarshal(safeProfile, &safeProfileStruct)
    if err != nil {
        return fmt.Sprintf("error: %s", err.Error())
    }

    return safeProfileStruct.Update()
}
