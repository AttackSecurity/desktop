package passwordAnalysis

import (
	"fmt"
	"sort"
	"strings"
	"unicode"
)

func AnalysisPassword(lines []string) Result {
	var totalChars, symbolCount, minLen, maxLen int
	lowerCaseCount := make(map[rune]int)
	upperCaseCount := make(map[rune]int)
	symbolCountMap := make(map[rune]int)
	digitCount := make(map[rune]int)
	charCount := make(map[rune]int)
	totalLength := 0
	passwordCount := 0
	passwordSet := make(map[string]struct{})
	minLen = 1<<31 - 1

	for _, line := range lines {
		password := line
		passLen := len(password)
		passwordSet[password] = struct{}{}
		totalLength += passLen
		if passLen < minLen {
			minLen = passLen
		}
		if passLen > maxLen {
			maxLen = passLen
		}
		passwordCount++

		for _, ch := range password {
			totalChars++
			charCount[ch]++
			if unicode.IsLower(ch) {
				lowerCaseCount[ch]++
			} else if unicode.IsUpper(ch) {
				upperCaseCount[ch]++
			} else if unicode.IsDigit(ch) {
				digitCount[ch]++
			} else if !unicode.IsLetter(ch) {
				symbolCount++
				symbolCountMap[ch]++
			}
		}
	}

	lowerPercent := float64(sumValues(lowerCaseCount)) / float64(totalChars) * 100
	upperPercent := float64(sumValues(upperCaseCount)) / float64(totalChars) * 100
	digitPercent := float64(sumValues(digitCount)) / float64(totalChars) * 100

	result := Result{
		TotalPasswords:        passwordCount,
		UniquePasswords:       len(passwordSet),
		AveragePasswordLength: float64(totalLength) / float64(passwordCount),
		MinimumPasswordLength: minLen,
		MaximumPasswordLength: maxLen,
		LowercasePercentage:   lowerPercent,
		MostUsedLowercase:     string(mostUsed(lowerCaseCount)),
		UppercasePercentage:   upperPercent,
		MostUsedUppercase:     string(mostUsed(upperCaseCount)),
		DigitsPercentage:      digitPercent,
		MostUsedDigit:         string(mostUsed(digitCount)),
		TotalSymbols:          symbolCount,
		MostUsedSymbol:        string(mostUsed(symbolCountMap)),
		Top3MostUsedChars:     topNMostUsedChars(charCount, 3),
		RegexPattern:          buildRegexPattern(lowerCaseCount, upperCaseCount, digitCount, symbolCountMap, minLen, maxLen),
	}

	return result
}

func sumValues(countMap map[rune]int) int {
	total := 0
	for _, count := range countMap {
		total += count
	}
	return total
}

func mostUsed(countMap map[rune]int) rune {
	var maxRune rune
	maxCount := 0
	for k, v := range countMap {
		if v > maxCount {
			maxRune = k
			maxCount = v
		}
	}
	return maxRune
}

func topNMostUsedChars(m map[rune]int, n int) []string {
	type kv struct {
		Key   rune
		Value int
	}
	var sorted []kv
	for k, v := range m {
		sorted = append(sorted, kv{k, v})
	}
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Value > sorted[j].Value
	})
	var topN []string
	for i := 0; i < n && i < len(sorted); i++ {
		topN = append(topN, string(sorted[i].Key))
	}
	return topN
}

func buildRegexPattern(lowerCaseCount, upperCaseCount, digitCount, symbolCountMap map[rune]int, minLen, maxLen int) string {
	pattern := "^"

	totalChars := sumValues(lowerCaseCount) + sumValues(upperCaseCount) + sumValues(digitCount) + sumValues(symbolCountMap)

	if len(lowerCaseCount) > 0 && float64(sumValues(lowerCaseCount))/float64(totalChars) > 0.1 {
		pattern += "(?=.*[a-z])"
	}

	if len(upperCaseCount) > 0 && float64(sumValues(upperCaseCount))/float64(totalChars) > 0.05 {
		pattern += "(?=.*[A-Z])"
	}

	if len(digitCount) > 0 && float64(sumValues(digitCount))/float64(totalChars) > 0.1 {
		pattern += "(?=.*\\d)"
	}

	if len(symbolCountMap) > 0 && float64(sumValues(symbolCountMap))/float64(totalChars) > 0.01 {
		symbolClass := createSymbolClass(symbolCountMap, 5)
		pattern += fmt.Sprintf("(?=.*[%s])", symbolClass)
	}

	pattern += fmt.Sprintf(".{%d,%d}$", minLen, maxLen)

	return pattern
}

func createSymbolClass(symbolCountMap map[rune]int, topN int) string {
	symbols := topNMostUsedChars(symbolCountMap, topN)
	sort.Slice(symbols, func(i, j int) bool {
		return symbols[i] < symbols[j]
	})
	return strings.Join(symbols, "")
}
