package utilities

import (
	"sync"
)

// WorkerFunc type defines the signature for the worker functions.
type WorkerFunc func(interface{}) error

// ConcurrentProcessor runs tasks concurrently.
// tasks: slice of tasks to process.
// worker: a function to process each task.
// numWorkers: number of concurrent workers.
func ConcurrentProcessor(tasks []interface{}, worker WorkerFunc, numWorkers int) error {
	var wg sync.WaitGroup
	taskChan := make(chan interface{}, numWorkers)

	// Launch workers.
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for task := range taskChan {
				if err := worker(task); err != nil {
					// Handle error or log it, depending on requirements
				}
			}
		}()
	}

	// Send tasks to the workers.
	for _, task := range tasks {
		taskChan <- task
	}
	close(taskChan)

	// Wait for all workers to finish.
	wg.Wait()
	return nil
}
