package passwordValidator

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"
)

func CheckPolicy(policy PasswordPolicy, password string) (bool, string) {
	if len(password) < policy.MinLength {
		return false, fmt.Sprintf("Password is too short, must be at least %d characters.", policy.MinLength)
	}
	if len(password) > policy.MaxLength {
		return false, fmt.Sprintf("Password is too long, must be no more than %d characters.", policy.MaxLength)
	}
	if policy.RequireUpper && !hasUpperCase(password) {
		return false, "Password must contain at least one uppercase letter."
	}
	if policy.RequireLower && !hasLowerCase(password) {
		return false, "Password must contain at least one lowercase letter."
	}
	if policy.RequireDigit && !hasDigit(password) {
		return false, "Password must contain at least one digit."
	}
	if policy.RequireSpecial && !strings.ContainsAny(password, policy.SpecialChars) {
		return false, "Password must contain at least one special character."
	}
	if policy.RegexPattern != "" && !regexp.MustCompile(policy.RegexPattern).MatchString(password) {
		return false, "Password does not match the required regex pattern."
	}

	return true, "Password meets all policy requirements."
}

func ValidatePassword(serviceName, presetPath, password string) (bool, string, error) {
	if len(presetPath) != 0 {
		policy, err := ParsePolicy(presetPath)
		if err != nil {
			return false, "", err
		}

		isValid, Reason := CheckPolicy(PasswordPolicy{
			ServiceName:    policy.ServiceName,
			MinLength:      policy.MinLength,
			MaxLength:      policy.MaxLength,
			RequireUpper:   policy.RequireUpper,
			RequireLower:   policy.RequireLower,
			RequireDigit:   policy.RequireDigit,
			RequireSpecial: policy.RequireSpecial,
			SpecialChars:   policy.SpecialChars,
			RegexPattern:   policy.RegexPattern,
		}, password)
		return isValid, Reason, nil
	}

	policy, exists := PasswordPolicies[serviceName]
	if !exists {
		return false, "", fmt.Errorf("no password policy found for %s", serviceName)
	}

	isValid, Reason := CheckPolicy(policy, password)
	return isValid, Reason, nil
}

func hasUpperCase(s string) bool {
	for _, char := range s {
		if unicode.IsUpper(char) {
			return true
		}
	}
	return false
}

func hasLowerCase(s string) bool {
	for _, char := range s {
		if unicode.IsLower(char) {
			return true
		}
	}
	return false
}

func hasDigit(s string) bool {
	for _, char := range s {
		if unicode.IsDigit(char) {
			return true
		}
	}
	return false
}
