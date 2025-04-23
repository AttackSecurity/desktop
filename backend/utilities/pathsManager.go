package utilities

import (
	"os"
	"path/filepath"
)

var (
	Directory string
)

func init() {
	configDir, err := os.UserConfigDir()
	if err != nil {
		panic("Unable to retrieve user config directory: " + err.Error())
	}

	appDataPath := filepath.Join(configDir, "AttackSecurityPro")
	Directory = appDataPath

	if err := os.MkdirAll(Directory, os.ModePerm); err != nil {
		panic("Unable to create application data directory: " + err.Error())
	}
}

func GetFilePath(fileName string) string {
	return filepath.Join(Directory, fileName)
}
