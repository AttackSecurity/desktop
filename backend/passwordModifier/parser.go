package passwordModifier

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
)

func ParsePolicy(filePath string) (*PasswordPolicy, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open policy file: %w", err)
	}
	defer file.Close()

	var p PasswordPolicy
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&p); err != nil {
		return nil, fmt.Errorf("error decoding JSON: %w", err)
	}

	return &p, nil
}

func CheckCustomPolicy(filePath string) (bool, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return false, fmt.Errorf("failed to open policy file: %w", err)
	}
	defer file.Close()

	var p PasswordPolicy
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&p); err != nil {
		return false, fmt.Errorf("error decoding JSON: %w", err)
	}

	if err := p.Validate(); err != nil {
		return false, fmt.Errorf("validation failed: %w", err)
	}

	return true, nil
}

func (p *PasswordPolicy) Validate() error {
	if p.Category == "" || p.UserPrefix == "" || p.UserSuffix == "" || p.CustomDomain == "" {
		return fmt.Errorf("Required fields missing or empty")
	}

	if p.MaxLength <= 0 {
		return fmt.Errorf("MaxLength must be greater than 0")
	}

	if p.RegexPattern != "" {
		if _, err := regexp.Compile(p.RegexPattern); err != nil {
			return fmt.Errorf("invalid RegexPattern: %v", err)
		}
	}

	if p.UserToMail && p.MailToUser {
		return fmt.Errorf("UserToMail and MailToUser cannot both be true")
	}
	return nil
}
