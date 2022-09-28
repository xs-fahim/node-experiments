package main

import (
	"fmt"
	"math"
	"strings"
	"syscall/js"
	"unicode"
)

// SplitOnNonLetters splits a string on non-letter runes
func SplitOnNonLetters(s string) []string {
	notALetter := func(char rune) bool { return !unicode.IsLetter(char) }
	return strings.FieldsFunc(s, notALetter)
}

func main() {
	// fmt.Printf("%+v\n", parts)
	c := make(chan int)
	js.Global().Set("ngrams", js.FuncOf(ngrams))
	<-c
	// for i, count := range ngrams(str, 1) {
	// 	if count > 1 {
	// 		fmt.Println(i, count)
	// 	}

	// }
}

func ngrams(this js.Value, i []js.Value) interface{} {
	c := i[0].String()
	str := strings.ToLower(c)
	words := SplitOnNonLetters(str)
	count := make(map[string]uint32, 0)
	fmt.Println(count)
	size := i[1].Int()
	offset := int(math.Floor(float64(size / 2)))

	max := len(words)
	for i := range words {
		if i < offset || i+size-offset > max {
			continue
		}
		gram := strings.Join(words[i-offset:i+size-offset], " ")
		count[gram]++
	}
	return count
}
