package smartFilter

import (
	"fmt"
	"regexp"
	"strings"
)

func batchProcessing(data []string, config Config) (results []string) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered in SmartFilter:", r)
		}
	}()

	extractPatterns := make([]*regexp.Regexp, len(config.Patterns))
	for i, pattern := range config.Patterns {
		finalRegex := strings.ReplaceAll(regexp.QuoteMeta(pattern), "%extract%", "(.+)")
		extractPatterns[i] = regexp.MustCompile(finalRegex)
	}

	// Iterate through the data in blocks, ensuring safe access
	for i := 0; i < len(data); i += config.BlockSize {
		var captures []interface{}
		patternMatched := make([]bool, len(config.Patterns))

		currentBlockSize := min(config.BlockSize, len(data)-i) // Ensure we do not go beyond data length
		for j := 0; j < currentBlockSize; j++ {
			if j >= len(extractPatterns) { // Check to prevent out of range error
				continue
			}
			matches := extractPatterns[j].FindStringSubmatch(data[i+j])
			if len(matches) > 1 {
				for _, match := range matches[1:] {
					captures = append(captures, match)
				}
				patternMatched[j] = true
			} else {
				patternMatched[j] = false
			}
		}

		// Verify if all patterns in the current block were matched
		allMatched := true
		for k := 0; k < len(patternMatched); k++ {
			if !patternMatched[k] {
				allMatched = false
				break
			}
		}

		if allMatched && len(captures) > 0 {
			result := fmt.Sprintf(config.Format, captures...)
			results = append(results, result)
		}
	}
	return results
}
func sequentialProcessing(data []string, config Config) (results []string) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered in SmartFilter:", r)
		}
	}()

	extractPatterns := make([]*regexp.Regexp, len(config.Patterns))
	for i, pattern := range config.Patterns {
		finalRegex := strings.ReplaceAll(regexp.QuoteMeta(pattern), "%extract%", "(.+)")
		extractPatterns[i] = regexp.MustCompile(finalRegex)
	}

	var captures []interface{}
	patternIndex := 0 // To keep track of which pattern we're looking for

	// Iterate through each line of data
	for i := 0; i < len(data); i++ {
		if patternIndex >= len(extractPatterns) { // Check to prevent out of range error
			break
		}
		matches := extractPatterns[patternIndex].FindStringSubmatch(data[i])
		if len(matches) > 1 {
			for _, match := range matches[1:] {
				captures = append(captures, match)
			}
			patternIndex++ // Move to the next pattern after a match
		}

		// Once all patterns have been matched in sequence, format and reset
		if patternIndex == len(extractPatterns) {
			if len(captures) > 0 {
				result := fmt.Sprintf(config.Format, captures...)
				results = append(results, result)
			}
			// Reset for next potential sequence in data
			captures = []interface{}{}
			patternIndex = 0
		}
	}
	return results
}

func SmartFilter(mode string, data []string, config Config) (results []string) {
	if mode == "sequential" {
		results = sequentialProcessing(data, config)
	} else if mode == "batch" {
		results = batchProcessing(data, config)
	}
	return results
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
