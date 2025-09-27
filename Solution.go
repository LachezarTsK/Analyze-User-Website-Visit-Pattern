
package main

import (
    "slices"
    "strings"
)

type Visit struct {
    website   string
    timestamp int
}

func NewVisit(website string, timestamp int) *Visit {
    visit := &Visit{
        website:   website,
        timestamp: timestamp,
    }
    return visit
}

const DELIMITER_BETWEEN_VALUES = ","
const NUMBER_OF_VISITED_WEBSITES_IN_PATTERN = 3

func mostVisitedPattern(username []string, timestamp []int, website []string) []string {
    
    var usernameToVisits map[string][]*Visit = 
                  createMapUsernameToVisits(username, timestamp, website)

    var visitedPatternToNumberOfUniqueUsernameVisits map[string]*HashSet =
                  createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits)

    return findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits)
}

func createMapUsernameToVisits(username []string, timestamp []int, website []string) map[string][]*Visit {
    usernameToVisits := map[string][]*Visit{}
    for i := range username {
        if _, has := usernameToVisits[username[i]]; !has {
            usernameToVisits[username[i]] = []*Visit{}
        }
        usernameToVisits[username[i]] = append(usernameToVisits[username[i]], NewVisit(website[i], timestamp[i]))
    }
    return usernameToVisits
}

func createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits map[string][]*Visit) map[string]*HashSet {
    visitedPatternToNumberOfUniqueUsernameVisits := map[string]*HashSet{}

    for user := range usernameToVisits {
        slices.SortFunc(usernameToVisits[user], func(x *Visit, y *Visit) int { return x.timestamp - y.timestamp })
        size := len(usernameToVisits[user])
        visitedWebsites := make([]string, NUMBER_OF_VISITED_WEBSITES_IN_PATTERN)

        for first := 0; first < size - 2; first++ {
            visitedWebsites[0] = (usernameToVisits[user])[first].website

            for second := first + 1; second < size - 1; second++ {
                visitedWebsites[1] = (usernameToVisits[user])[second].website

                for third := second + 1; third < size; third++ {
                    visitedWebsites[2] = (usernameToVisits[user])[third].website

                    pattern := strings.Join(visitedWebsites, DELIMITER_BETWEEN_VALUES)
                    if _, has := visitedPatternToNumberOfUniqueUsernameVisits[pattern]; !has {
                        visitedPatternToNumberOfUniqueUsernameVisits[pattern] = NewHashSet()
                    }
                    visitedPatternToNumberOfUniqueUsernameVisits[pattern].Add(user)
                }
            }
        }
    }

    return visitedPatternToNumberOfUniqueUsernameVisits
}

func findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits map[string]*HashSet) []string {
    mostVisitedPattern := ""
    numberOfUniqueUsernameVisits := 0

    for pattern := range visitedPatternToNumberOfUniqueUsernameVisits {
        if visitedPatternToNumberOfUniqueUsernameVisits[pattern].Size() < numberOfUniqueUsernameVisits {
            continue
        }
        if visitedPatternToNumberOfUniqueUsernameVisits[pattern].Size() > numberOfUniqueUsernameVisits {
            mostVisitedPattern = pattern
            numberOfUniqueUsernameVisits = visitedPatternToNumberOfUniqueUsernameVisits[pattern].Size()
            continue
        }
        if pattern < mostVisitedPattern {
            mostVisitedPattern = pattern
        }
    }

    dOne := strings.Index(mostVisitedPattern, DELIMITER_BETWEEN_VALUES)
    dTwo := strings.LastIndex(mostVisitedPattern, DELIMITER_BETWEEN_VALUES)
    dSize := len(DELIMITER_BETWEEN_VALUES)

    return []string{mostVisitedPattern[:dOne],
                    mostVisitedPattern[dOne + dSize : dTwo],
                    mostVisitedPattern[dTwo + dSize:]}
}

type HashSet struct {
    conainer map[string]bool
}

func NewHashSet() *HashSet {
    return &HashSet{conainer: map[string]bool{}}
}

func (this *HashSet) Contains(value string) bool {
    return this.conainer[value]
}

func (this *HashSet) Add(value string) {
    this.conainer[value] = true
}

func (this *HashSet) Remove(value string) {
    delete(this.conainer, value)
}

func (this *HashSet) Size() int {
    return len(this.conainer)
}
