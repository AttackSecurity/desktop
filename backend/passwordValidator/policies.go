package passwordValidator

type PasswordPolicy struct {
	ServiceName    string
	MinLength      int
	MaxLength      int
	RequireUpper   bool
	RequireLower   bool
	RequireDigit   bool
	RequireSpecial bool
	SpecialChars   string
	RegexPattern   string
}

type PasswordPolicyCustom struct {
	Author         string `json:"author"`
	Description    string `json:"description"`
	ServiceURL     string `json:"serviceUrl"`
	ServiceName    string `json:"serviceName"`
	MinLength      int    `json:"minLength"`
	MaxLength      int    `json:"maxLength"`
	RequireUpper   bool   `json:"requireUpper"`
	RequireLower   bool   `json:"requireLower"`
	RequireDigit   bool   `json:"requireDigit"`
	RequireSpecial bool   `json:"requireSpecial"`
	SpecialChars   string `json:"specialChars"`
	RegexPattern   string `json:"regexPattern"`
}

type Output struct {
	Passed  int
	Failed  int
	Lines   int
	Error   error
	Success bool
}

var PasswordPolicies = map[string]PasswordPolicy{
	"Netflix":      {ServiceName: "Netflix", MinLength: 6, MaxLength: 60},
	"Crunchyroll":  {ServiceName: "Crunchyroll", MinLength: 6, MaxLength: 32},
	"Crunchyroll2": {ServiceName: "Crunchyroll", MinLength: 6, MaxLength: 32},
}
