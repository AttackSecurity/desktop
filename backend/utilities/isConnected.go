package utilities

import (
	"gopkg.in/toast.v1"
	"log"
	"net/http"
	"os"
	"time"
)

func IsOnline() bool {
	timeout := 5000 * time.Millisecond

	client := http.Client{
		Timeout: timeout,
	}

	_, err := client.Get("https://google.com")

	if err != nil {
		return false
	}

	return true
}

func init() {
	if !IsOnline() {
		notification := toast.Notification{
			AppID:   "AttackSec.pro",
			Title:   "Information",
			Message: "Please connect to Internet to continue using.",
			Actions: []toast.Action{
				{"protocol", "OK!", ""},
			},
		}
		err := notification.Push()
		if err != nil {
			log.Fatalln(err)
		}
		os.Exit(0)
	}
}
