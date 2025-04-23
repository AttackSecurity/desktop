package passwordAnalysis

import "fmt"

type Result struct {
	TotalPasswords        int
	UniquePasswords       int
	AveragePasswordLength float64
	MinimumPasswordLength int
	MaximumPasswordLength int
	LowercasePercentage   float64
	MostUsedLowercase     string
	UppercasePercentage   float64
	MostUsedUppercase     string
	DigitsPercentage      float64
	MostUsedDigit         string
	TotalSymbols          int
	MostUsedSymbol        string
	Top3MostUsedChars     []string
	RegexPattern          string
	Error                 error
	Success               bool
}

func (r Result) String() string {
	return fmt.Sprintf(
		"TotalPasswords: %d\nUniquePasswords: %d\nAveragePasswordLength: %.2f\nMinimumPasswordLength: %d\nMaximumPasswordLength: %d\nLowercasePercentage: %.2f\nMostUsedLowercase: %s\nUppercasePercentage: %.2f\nMostUsedUppercase: %s\nDigitsPercentage: %.2f\nMostUsedDigit: %s\nTotalSymbols: %d\nMostUsedSymbol: %s\nTop3MostUsedChars: %v\nRegexPattern: %s\nError: %s\nSuccess: %t",
		r.TotalPasswords,
		r.UniquePasswords,
		r.AveragePasswordLength,
		r.MinimumPasswordLength,
		r.MaximumPasswordLength,
		r.LowercasePercentage,
		r.MostUsedLowercase,
		r.UppercasePercentage,
		r.MostUsedUppercase,
		r.DigitsPercentage,
		r.MostUsedDigit,
		r.TotalSymbols,
		r.MostUsedSymbol,
		r.Top3MostUsedChars,
		r.RegexPattern,
		r.Error,
		r.Success,
	)
}
