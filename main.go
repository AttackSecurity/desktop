package main

import (
	"AttackSec/backend"
	"AttackSec/backend/utilities"
	"embed"
	"github.com/leaanthony/adfer"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"log"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

var crashReporter = adfer.New(adfer.Options{
	DumpToFile:        true,
	FilePath:          utilities.GetFilePath("crash_reports.json"),
	IncludeSystemInfo: true,
})

func main() {
	settings, _ := utilities.LoadSettings()
	hardwareAcceleration := settings.HardwareAcceleration
	alwaysOnTop := settings.AlwaysOnTop
	defer crashReporter.Recover()

	app := backend.NewApp()
	err := wails.Run(&options.App{
		Title:                    "AttackSec",
		Width:                    1424,
		Height:                   705,
		DisableResize:            true,
		Fullscreen:               false,
		WindowStartState:         options.Normal,
		HideWindowOnClose:        false,
		Frameless:                true,
		StartHidden:              false,
		AlwaysOnTop:              alwaysOnTop,
		Assets:                   assets,
		Menu:                     nil,
		Logger:                   nil,
		LogLevel:                 logger.DEBUG,
		OnStartup:                app.Startup,
		OnBeforeClose:            app.BeforeClose,
		OnDomReady:               app.OnDomReady,
		EnableDefaultContextMenu: false,

		/*SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId:               "ATTACKSEC-e3984e08-28dc-4e3d-b70a-45e961589cdc",
			OnSecondInstanceLaunch: app.onSecondInstanceLaunch,
		},*/

		DragAndDrop: &options.DragAndDrop{
			EnableFileDrop:     true,
			DisableWebViewDrop: false,
		},

		Bind: []interface{}{
			app,
		},

		Windows: &windows.Options{
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			DisableWindowIcon:    true,
			WebviewGpuIsDisabled: hardwareAcceleration,
			WebviewUserDataPath:  utilities.Directory,
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
