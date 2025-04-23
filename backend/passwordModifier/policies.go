package passwordModifier

type PasswordPolicy struct {
	Category            string `json:"Category"`
	PassPrefix          string `json:"PassPrefix"`
	PassSuffix          string `json:"PassSuffix"`
	UserPrefix          string `json:"UserPrefix"`
	UserSuffix          string `json:"UserSuffix"`
	CustomDomain        string `json:"CustomDomain"`
	RegexPattern        string `json:"RegexPattern"`
	MaxLength           int    `json:"MaxLength"`
	UserToMail          bool   `json:"UserToMail"`
	KeepOldLines        bool   `json:"KeepOldLines"`
	CharacterToNumber   bool   `json:"CharacterToNumber"`
	CapitalizePasswords bool   `json:"CapitalizePasswords"`
	MailToUser          bool   `json:"MailToUser"`
}

type Output struct {
	Modified int
	Failed   int
	Lines    int
	Error    error
	Success  bool
}

var PasswordPolicies = map[string]PasswordPolicy{
	"Gaming": {Category: "Gaming", PassSuffix: "!ATTACKSEC"},
}
