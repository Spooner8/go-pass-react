package safeProfile

import (
	"encoding/json"
	"fmt"
	"go-pass-react/models"
)

func CreateSafeProfile(safeProfile json.RawMessage) string {
	safeProfileStruct := models.SafeProfile{}
	err := json.Unmarshal(safeProfile, &safeProfileStruct)
	if err != nil {
		return fmt.Sprintf("Error: %s", err.Error())
	}

	return safeProfileStruct.Create(safeProfileStruct)
}

func GetSafeProfile(filePath string) (models.SafeProfile, error) {
	safeProfile := models.SafeProfile{}
	safeProfile.FilePath = filePath

	return safeProfile.Get()
}

func UpdateSafeProfile(safeProfile json.RawMessage) string {
	safeProfileStruct := models.SafeProfile{}
	err := json.Unmarshal(safeProfile, &safeProfileStruct)
	if err != nil {
		return fmt.Sprintf("Error: %s", err.Error())
	}

	return safeProfileStruct.Update(safeProfileStruct)
}
