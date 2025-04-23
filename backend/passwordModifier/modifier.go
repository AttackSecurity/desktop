package passwordModifier

import (
	"fmt"
	"regexp"
	"strings"
)

func CheckPolicy(policy PasswordPolicy, username, password string) (bool, string, string) {
	if policy.MaxLength > 0 && len(password) > policy.MaxLength {
		return false, password, fmt.Sprintf("Password must be no longer than %d characters.", policy.MaxLength)
	}

	if policy.RegexPattern != "" {
		matched, _ := regexp.MatchString(policy.RegexPattern, password)
		if !matched {
			return false, password, "Password does not match the required pattern."
		}
	}

	if policy.PassPrefix != "" {
		password = policy.PassPrefix + password
	}
	if policy.PassSuffix != "" {
		password = password + policy.PassSuffix
	}

	if len(username) != 0 {
		if policy.UserPrefix != "" {
			username = policy.UserPrefix + username
		}
		if policy.UserSuffix != "" {
			username = username + policy.UserSuffix
		}

		if policy.CustomDomain != "" {
			atIndex := strings.LastIndex(username, "@")
			if atIndex != -1 {
				username = username[:atIndex+1] + policy.CustomDomain
			}
		}

		if policy.UserToMail {
			username = username + "@" + policy.CustomDomain
		}
	}

	if policy.CapitalizePasswords {
		password = strings.ToUpper(password)
	}

	if policy.CharacterToNumber {
		password = strings.Map(func(r rune) rune {
			switch r {
			case 'a', 'A':
				return '4'
			case 'e', 'E':
				return '3'
			case 'i', 'I':
				return '1'
			case 'o', 'O':
				return '0'
			case 's', 'Z':
				return '5'
			default:
				return r
			}
		}, password)
	}

	return true, password, ""
}

func ModifyPassword(serviceName, presetPath, username, password string) (bool, string, string, error) {
	if len(presetPath) != 0 {
		policy, err := ParsePolicy(presetPath)
		if err != nil {
			return false, "", "", err
		}

		isValid, modifiedPassword, reason := CheckPolicy(*policy, username, password)
		if !isValid {
			return false, "", reason, fmt.Errorf("password does not meet the policy requirements")
		}

		return true, modifiedPassword, "", nil
	}

	policy, exists := PasswordPolicies[serviceName]
	if !exists {
		return false, "", "", fmt.Errorf("no password policy found for %s", serviceName)
	}

	isValid, modifiedPassword, reason := CheckPolicy(policy, username, password)
	if !isValid {
		return false, "", reason, fmt.Errorf("password does not meet the policy requirements")
	}

	return true, modifiedPassword, "", nil
}
