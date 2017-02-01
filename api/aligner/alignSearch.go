package aligner

import (
	"sync"
)

func Canary(str string) string {
	return str
}

type result struct {
	name  string
	score float64
}

func AlignSearch(targetSeq string, sequences [][]string, matchScore, mismatchPenalty, gapPenalty,
	gapOpeningPenalty float64) []result {

	var wg sync.WaitGroup
	wg.Add(len(sequences))
	results := make([]result, len(sequences))

	for i := 0; i < len(sequences); i++ {
		go func(i int) {
			defer wg.Done()
			seqName := sequences[i][0]
			seq := sequences[i][1]
			score := AlignScore(targetSeq, seq, matchScore, mismatchPenalty, gapPenalty, gapOpeningPenalty)
			currentResult := result{seqName, score}
			results[i] = currentResult
		}(i)
	}

	wg.Wait()

	return results
}
