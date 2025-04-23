package passwordValidator

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
)

func ParsePolicy(filePath string) (*PasswordPolicyCustom, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open policy file: %w", err)
	}
	defer file.Close()

	var p PasswordPolicyCustom
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&p); err != nil {
		return nil, fmt.Errorf("error decoding JSON: %w", err)
	}

	return &p, nil
}

func (p *PasswordPolicyCustom) Validate() error {
	if p.Author == "" {
		return fmt.Errorf("author is required")
	}
	if p.Description == "" {
		return fmt.Errorf("description is required")
	}
	if p.ServiceURL == "" {
		return fmt.Errorf("service URL is required")
	}
	if p.ServiceName == "" {
		return fmt.Errorf("service name is required")
	}

	if p.MinLength <= 0 {
		return fmt.Errorf("minLength must be greater than 0")
	}
	if p.MaxLength < p.MinLength {
		return fmt.Errorf("maxLength cannot be less than minLength")
	}

	if p.RequireSpecial && p.SpecialChars == "" {
		return fmt.Errorf("specialChars must be provided if requireSpecial is true")
	}

	if p.RegexPattern != "" {
		if _, err := regexp.Compile(p.RegexPattern); err != nil {
			return fmt.Errorf("invalid regex pattern: %v", err)
		}
	}

	return nil
}

func CheckCustomPolicy(filePath string) (bool, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return false, fmt.Errorf("failed to open policy file: %w", err)
	}
	defer file.Close()

	var p PasswordPolicyCustom
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&p); err != nil {
		return false, fmt.Errorf("error decoding JSON: %w", err)
	}

	if err := p.Validate(); err != nil {
		return false, fmt.Errorf("validation failed: %w", err)
	}

	return true, nil
}
