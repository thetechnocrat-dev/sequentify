package aligner

import (
	"sync"
)

type Result struct {
	Name  string
	Score float64
}

func AlignSearch(targetSeq string, sequences [][]string, matchScore, mismatchPenalty, gapPenalty,
	gapOpeningPenalty float64) []Result {

	var wg sync.WaitGroup
	wg.Add(len(sequences))
	results := make([]Result, len(sequences))

	for i := 0; i < len(sequences); i++ {
		go func(i int) {
			defer wg.Done()
			seqName := sequences[i][0]
			seq := sequences[i][1]
			score := AlignScore(targetSeq, seq, matchScore, mismatchPenalty, gapPenalty, gapOpeningPenalty)
			currentResult := Result{seqName, score}
			results[i] = currentResult
		}(i)
	}

	wg.Wait()

	return results
}
