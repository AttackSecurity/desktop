package utilities

import (
	"fmt"
	"os"
)

var flag = false

func ShowTutorial() bool {
	if flag {
		return true
	}

	fileName := "tutorialCompleted.temp"
	if _, err := os.Stat(GetFilePath(fileName)); err == nil {
		return false
	} else {
		_, err := os.Create(GetFilePath(fileName))
		if err != nil {
			fmt.Errorf(err.Error())
		}
		flag = true
		return true
	}
}

func TutorialCompleted() {
	flag = false
}
