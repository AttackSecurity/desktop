package backend

import (
	"AttackSec/backend/passwordAnalysis"
	"AttackSec/backend/passwordModifier"
	"AttackSec/backend/passwordValidator"
	"AttackSec/backend/smartFilter"
	"AttackSec/backend/utilities"
	"context"
	"fmt"
	"github.com/sqweek/dialog"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"log"
	"os"
	"strings"
	"sync"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) OnDomReady(ctx context.Context) {}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) BeforeClose(ctx context.Context) (prevent bool) {
	messageDialog, err := runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
		Type:    runtime.QuestionDialog,
		Title:   "AttackSecurity",
		Message: "Are you sure you want to quit?",
	})

	if err != nil {
		return false
	}
	return messageDialog != "Yes"
}

func (a *App) ExitProgram() {
	os.Exit(0)
}

func (a *App) GetServiceNames() []string {
	var serviceNames []string
	for _, policy := range passwordValidator.PasswordPolicies {
		serviceNames = append(serviceNames, policy.ServiceName)
	}
	return serviceNames
}

func (a *App) GetCategories() []string {
	var categories []string
	for _, policy := range passwordModifier.PasswordPolicies {
		categories = append(categories, policy.Category)
	}
	return categories
}

func (a *App) FileDialog(fileType string) string {
	inputFilePath, _ := dialog.File().Filter(fmt.Sprintf(".%v files", fileType), fileType).Title(fmt.Sprintf("Select .%v File", fileType)).Load()
	return inputFilePath
}

func (a *App) InitializeConfig() utilities.Settings {
	loadedSettings, err := utilities.LoadSettings()
	if err != nil {
		log.Fatalf("Failed to load utilities: %v", err)
	}
	return *loadedSettings
}

func (a *App) CheckCustomPolicy(filePath string) (bool, error) {
	isValid, err := passwordValidator.CheckCustomPolicy(filePath)
	return isValid, err
}

func (a *App) CheckCustomPolicyModifier(filePath string) (bool, error) {
	isValid, err := passwordModifier.CheckCustomPolicy(filePath)
	return isValid, err
}

func (a *App) RunPasswordValidator(filePath, preset, presetPath string) passwordValidator.Output {
	var passed, failed int
	var mu sync.Mutex

	var passedLines, failedLines []string

	lines, err := utilities.ReadLines(filePath)
	if err != nil {
		return passwordValidator.Output{Error: err, Success: false}
	}

	settings, err := utilities.LoadSettings()
	if err != nil {
		return passwordValidator.Output{Error: err, Success: false}
	}
	lineFormat := settings.LineFormat

	worker := func(task interface{}) error {
		line := task.(string)
		pass := ""
		switch lineFormat {
		case "user:pass":
			pass = strings.Split(line, ":")[1]
		case "pass:user":
			pass = strings.Split(line, ":")[0]
		case "pass":
			pass = line
		}

		valid, reason, _ := passwordValidator.ValidatePassword(preset, presetPath, pass)
		mu.Lock()
		if valid {
			passed++
			passedLines = append(passedLines, line)
		} else {
			failed++
			failedLines = append(failedLines, fmt.Sprintf("%v [%v]", reason, line))
		}
		mu.Unlock()
		return nil
	}

	tasks := make([]interface{}, len(lines))
	for i, line := range lines {
		tasks[i] = line
	}

	if err := utilities.ConcurrentProcessor(tasks, worker, settings.MaxWorkers); err != nil {
		return passwordValidator.Output{Error: err, Success: false}
	}

	data := map[string][]string{
		"passed": passedLines,
		"failed": failedLines,
	}

	if err := utilities.ExportResults(data, "Password Validator"); err != nil {
		log.Fatalf("Export failed: %v", err)
	}

	return passwordValidator.Output{
		Passed:  passed,
		Failed:  failed,
		Lines:   len(lines),
		Error:   nil,
		Success: true,
	}
}

func (a *App) RunPasswordModifier(filePath, preset, presetPath string) passwordModifier.Output {
	var passed, failed int
	var mu sync.Mutex

	var modifiedLines, failedLines []string

	lines, err := utilities.ReadLines(filePath)
	if err != nil {
		return passwordModifier.Output{Error: err, Success: false}
	}

	settings, err := utilities.LoadSettings()
	if err != nil {
		return passwordModifier.Output{Error: err, Success: false}
	}
	lineFormat := settings.LineFormat

	worker := func(task interface{}) error {
		line := task.(string)
		pass, user := "", ""
		switch lineFormat {
		case "user:pass":
			parts := strings.Split(line, ":")
			if len(parts) == 2 {
				user = parts[0]
				pass = parts[1]
			}
		case "pass:user":
			parts := strings.Split(line, ":")
			if len(parts) == 2 {
				pass = parts[0]
				user = parts[1]
			}
		case "pass":
			pass = line
		}

		valid, modifiedPass, reason, _ := passwordModifier.ModifyPassword(preset, presetPath, user, pass)
		mu.Lock()
		if valid {
			passed++
			modifiedLines = append(modifiedLines, modifiedPass)
		} else {
			failed++
			failedLines = append(failedLines, fmt.Sprintf("%v [%v]", reason, line))
		}
		mu.Unlock()
		return nil
	}

	tasks := make([]interface{}, len(lines))
	for i, line := range lines {
		tasks[i] = line
	}

	if err := utilities.ConcurrentProcessor(tasks, worker, settings.MaxWorkers); err != nil {
		return passwordModifier.Output{Error: err, Success: false}
	}

	data := map[string][]string{
		"modified": modifiedLines,
		"failed":   failedLines,
	}

	if err := utilities.ExportResults(data, "Password Modifier"); err != nil {
		log.Fatalf("Export failed: %v", err)
	}

	return passwordModifier.Output{
		Modified: passed,
		Failed:   failed,
		Lines:    len(lines),
		Error:    nil,
		Success:  true,
	}
}

func (a *App) RunSmartFilter(mode, filePath, patterns, format string, blockSize int) []string {
	lines, err := utilities.ReadLines(filePath)
	if err != nil {
		return nil
	}

	config := smartFilter.Config{
		Patterns:  strings.Split(patterns, "\n"),
		BlockSize: blockSize,
		Format:    format,
	}

	result := smartFilter.SmartFilter(mode, lines, config)

	data := map[string][]string{
		"extracted": result,
	}

	if err := utilities.ExportResults(data, "Smart Filter"); err != nil {
		log.Fatalf("Export failed: %v", err)
	}

	return result
}

func (a *App) RunPasswordAnalysis(filePath string) passwordAnalysis.Result {
	lines, err := utilities.ReadLines(filePath)
	if err != nil {
		return passwordAnalysis.Result{Error: err, Success: false}
	}

	result := passwordAnalysis.AnalysisPassword(lines)

	data := map[string][]string{
		"analysed": {result.String()},
	}

	if err := utilities.ExportResults(data, "Password Analysis"); err != nil {
		log.Fatalf("Export failed: %v", err)
	}

	return result
}

func (a *App) ShowTutorial() bool {
	return utilities.ShowTutorial()
}

func (a *App) ChangeSettings(newSettings *utilities.Settings) error {
	return utilities.ChangeSettings(newSettings)
}

func (a *App) RestartApplication() {
	utilities.RestartSelf()
}

func (a *App) CheckCrash() bool {
	var isCrashed bool

	utilities.CrashReporter(func() {
		err := os.Remove(utilities.GetFilePath("crash_reports.json"))
		if err != nil {
			fmt.Errorf(err.Error())
			return
		}
		isCrashed = true
	})
	return isCrashed
}

func (a *App) TutorialCompleted() {
	utilities.TutorialCompleted()
}
