package utilities

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

func CrashReporter(onFound func()) {
	fileData, err := ioutil.ReadFile(GetFilePath("crash_reports.json"))
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	var jsonData []interface{}
	err = json.Unmarshal(fileData, &jsonData)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return
	}

	if len(jsonData) > 0 {
		onFound()
	}
}
