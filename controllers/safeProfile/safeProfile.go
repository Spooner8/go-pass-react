package safeProfile

import (
	"encoding/json"
	"fmt"
	"go-pass-react/controllers/passSystem"
	"go-pass-react/controllers/passwordHelpers"
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
	defer func() {
		if closeErr := file.Close(); closeErr != nil {
			fmt.Printf("Error closing file: %s", closeErr.Error())
		}
	}()

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
	defer func() {
		if closeErr := file.Close(); closeErr != nil {
			fmt.Printf("Error closing file: %s", closeErr.Error())
		}
	}()

	safeProfileStruct := models.SafeProfile{}
	err = json.NewDecoder(file).Decode(&safeProfileStruct)
	if err != nil {
		return nil, fmt.Errorf("error: %s", err.Error())
	}

	for i := range safeProfileStruct.Passwords {
		decryptedPassword, err := passwordHelpers.DecryptAES(safeProfileStruct.Passwords[i].Password)
		if err != nil {
			return nil, fmt.Errorf("error decrypting passwords: %s", err.Error())
		}
		safeProfileStruct.Passwords[i].Password = decryptedPassword
	}
	return json.Marshal(safeProfileStruct)
}

func UpdateSafeProfile(safeProfile json.RawMessage) string {
	safeProfileStruct := models.SafeProfile{}
	err := json.Unmarshal(safeProfile, &safeProfileStruct)
	if err != nil {
		return fmt.Sprintf("error: %s", err.Error())
	}

	for i := range safeProfileStruct.Passwords {
		encryptedPassword, err := passwordHelpers.EncryptAES(safeProfileStruct.Passwords[i].Password)
		if err != nil {
			return fmt.Sprintf("error encrypting password: %s", err.Error())
		}
		safeProfileStruct.Passwords[i].Password = encryptedPassword
	}

	return safeProfileStruct.Update()
}
