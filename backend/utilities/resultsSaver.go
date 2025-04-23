package utilities

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

func ExportResults(data map[string][]string, module string) error {
	exportPath, err := exportPathForge(module)
	if err != nil {
		return fmt.Errorf("failed to generate export path: %w", err)
	}

	for filename, content := range data {
		if err := exportSingleResult(content, exportPath, filename); err != nil {
			return fmt.Errorf("failed to export file %s: %w", filename, err)
		}
	}
	return nil
}

func exportSingleResult(data []string, path, filename string) error {
	filePath := filepath.Join(path, filename+".txt")
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create file %s: %w", filePath, err)
	}
	defer file.Close()

	writer := bufio.NewWriter(file)
	for _, line := range data {
		if _, err := writer.WriteString(line + "\n"); err != nil {
			return fmt.Errorf("failed to write to file %s: %w", filePath, err)
		}
	}
	return writer.Flush()
}

func exportPathForge(moduleName string) (string, error) {
	now := time.Now()
	dateTime := now.Format("2006-01-02 15-04-05")

	path := filepath.Join("Results", moduleName, dateTime)
	if err := os.MkdirAll(path, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory %s: %w", path, err)
	}
	return path, nil
}
