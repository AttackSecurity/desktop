package utilities

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"path/filepath"
	"reflect"
)

type Settings struct {
	FormatNumbers        bool   `json:"formatNumbers"`
	LineFormat           string `json:"lineFormat"`
	MaxWorkers           int    `json:"maxWorkers"`
	HardwareAcceleration bool   `json:"hardwareAcceleration"`
	AlwaysOnTop          bool   `json:"alwaysOnTop"`
}

func NewSettings() *Settings {
	return &Settings{
		FormatNumbers:        true,
		LineFormat:           "pass",
		MaxWorkers:           20,
		HardwareAcceleration: true,
		AlwaysOnTop:          true,
	}
}

func writeDefaultsToFile(path string) error {
	settings := NewSettings()
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}
	return ioutil.WriteFile(path, data, 0644)
}

func validateSettings(settings *Settings) error {
	defaultSettings := NewSettings()
	defaultType := reflect.TypeOf(*defaultSettings)
	settingsValue := reflect.ValueOf(*settings)

	for i := 0; i < defaultType.NumField(); i++ {
		field := defaultType.Field(i)
		value := settingsValue.Field(i)

		if value.Type() != field.Type {
			return errors.New("invalid settings type for field " + field.Name)
		}
	}

	return nil
}

func LoadSettings() (*Settings, error) {
	configDir, _ := os.UserConfigDir()
	path := filepath.Join(configDir, "AttackSecurityPro", "settings.json")

	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		err := writeDefaultsToFile(path)
		if err != nil {
			return nil, err
		}
		return NewSettings(), nil
	}

	file, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	settings := NewSettings()
	err = json.Unmarshal(file, settings)
	if err != nil {
		err := writeDefaultsToFile(path)
		if err != nil {
			return nil, err
		}
		return NewSettings(), nil
	}

	err = validateSettings(settings)
	if err != nil {
		err := writeDefaultsToFile(path)
		if err != nil {
			return nil, err
		}
		return NewSettings(), nil
	}

	return settings, nil
}

func ChangeSettings(newSettings *Settings) error {
	configDir, _ := os.UserConfigDir()
	path := filepath.Join(configDir, "AttackSecurityPro", "settings.json")

	err := validateSettings(newSettings)
	if err != nil {
		return err
	}

	data, err := json.MarshalIndent(newSettings, "", "  ")
	if err != nil {
		return err
	}

	err = os.WriteFile(path, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func GetSettings() (*Settings, error) {
	configDir, _ := os.UserConfigDir()
	path := filepath.Join(configDir, "AttackSecurityPro", "settings.json")

	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return nil, errors.New("settings file does not exist")
	}

	file, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	settings := NewSettings()
	err = json.Unmarshal(file, settings)
	if err != nil {
		return nil, err
	}

	err = validateSettings(settings)
	if err != nil {
		return nil, err
	}

	return settings, nil
}
