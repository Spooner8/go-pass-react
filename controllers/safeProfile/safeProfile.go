package safeProfile

import (
	"encoding/json"
	"fmt"
	"go-pass-react/controllers/passSystem"
	"go-pass-react/models"
	"os"
)

func CreateSafeProfile(safeProfile json.RawMessage) string {
	safeProfileStruct := models.SafeProfile{}
	err := json.Unmarshal(safeProfile, &safeProfileStruct)
	if err != nil {
		return fmt.Sprintf("error while unmarshal: %s", err.Error())
	}

	return safeProfileStruct.Create()
}

func GetSafeProfile() (json.RawMessage, error) {
	filePath := passSystem.SelectFile()
	if filePath == "" {
		return nil, fmt.Errorf("error: no file selected")
	}

	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("error: %s", err.Error())
	}
	defer file.Close()

	jsonData := json.RawMessage{}
	err = json.NewDecoder(file).Decode(&jsonData)
	if err != nil {
		return nil, fmt.Errorf("error: %s", err.Error())
	}

	return jsonData, nil
}

func GetSafeProfileFromPath(filePath string) (json.RawMessage, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("error: %s", err.Error())
	}
	defer file.Close()

	jsonData := json.RawMessage{}
	err = json.NewDecoder(file).Decode(&jsonData)
	if err != nil {
		return nil, fmt.Errorf("error: %s", err.Error())
	}

	return jsonData, nil
}

func UpdateSafeProfile(safeProfile json.RawMessage) string {
	safeProfileStruct := models.SafeProfile{}
	err := json.Unmarshal(safeProfile, &safeProfileStruct)
	if err != nil {
		return fmt.Sprintf("error: %s", err.Error())
	}

	return safeProfileStruct.Update()
}
