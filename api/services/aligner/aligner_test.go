package aligner

import (
	"testing"
)

// Utility functions and structs
type AlignTest struct {
	seq1, seq2, message string
	expected            []string
}

func compareArrays(arr1, arr2 []string) bool {
	if len(arr1) != len(arr2) {
		return false
	}

	for i, element1 := range arr1 {
		element2 := arr2[i]
		if element1 != element2 {
			return false
		}
	}

	return true
}

func compareResultArrays(results1, results2 []result) bool {
	if len(results1) != len(results2) {
		return false
	}

	for i, result1 := range results1 {
		result2 := results2[i]
		if result1.name != result2.name || result1.score != result2.score {
			return false
		}
	}
	return true
}

// Tests
func TestAlign(t *testing.T) {
	const matchScore = float64(4)
	const mismatchPenalty = float64(-6)
	const gapPenalty = float64(-4)
	const gapOpeningPenalty = float64(-8)

	alignTests := []AlignTest{
		AlignTest{
			"gcat",
			"gcat",
			"Align does not work with identical sequences",
			[]string{"gg", "cc", "aa", "tt"},
		},
		AlignTest{
			"gt",
			"ca",
			"Align does not work when there are no matches",
			[]string{"gc", "ta"},
		},
		AlignTest{
			"actag",
			"ctaga",
			"Align does not work with gaps",
			[]string{"a_", "cc", "tt", "aa", "gg", "_a"},
		},
	}

	for _, test := range alignTests {
		actual := Align(test.seq1, test.seq2, matchScore, mismatchPenalty, gapPenalty, gapOpeningPenalty)
		if !compareArrays(actual, test.expected) {
			t.Error(test.message)
			t.Logf("expected %v, actual %v", test.expected, actual)
		}
	}
}

func TestAlignSearch(t *testing.T) {
	targetSeq := "actg"
	sequences := make([][]string, 3)
	sequences[0] = []string{"s1", "actg"}
	sequences[1] = []string{"s2", "cctg"}
	sequences[2] = []string{"s3", "aaag"}
	const matchScore = float64(4)
	const mismatchPenalty = float64(-6)
	const gapPenalty = float64(-4)
	const gapOpeningPenalty = float64(-8)

	actual := AlignSearch(targetSeq, sequences, matchScore, mismatchPenalty, gapPenalty, gapOpeningPenalty)
	expected := make([]result, 3)
	expected[0] = result{"s1", 16.0}
	expected[1] = result{"s2", 6.0}
	expected[2] = result{"s3", -4.0}

	if !compareResultArrays(actual, actual) {
		t.Error("AlignSearch does not work")
		t.Logf("expected %v, actual %v", expected, actual)
	}
}
