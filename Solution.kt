
class Solution {

    private data class Visit(val website: String, val timestamp: Int) {}

    private companion object {
        const val DELIMITER_BETWEEN_VALUES = ","
        const val NUMBER_OF_VISITED_WEBSITES_IN_PATTERN = 3
    }

    fun mostVisitedPattern(username: Array<String>, timestamp: IntArray, website: Array<String>): List<String> {
      
        val usernameToVisits: MutableMap<String, MutableList<Visit>> =
            createMapUsernameToVisits(username, timestamp, website);

        val visitedPatternToNumberOfUniqueUsernameVisits: MutableMap<String, MutableSet<String>> =
            createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits);

        return findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits);
    }

    private fun createMapUsernameToVisits(username: Array<String>, timestamp: IntArray, website: Array<String>): MutableMap<String, MutableList<Visit>> {
        val usernameToVisits = mutableMapOf<String, MutableList<Visit>>()
        for (i in username.indices) {
            usernameToVisits.putIfAbsent(username[i], mutableListOf())
            usernameToVisits[username[i]]!!.add(Visit(website[i], timestamp[i]))
        }
        return usernameToVisits
    }

    private fun createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits: MutableMap<String, MutableList<Visit>>): MutableMap<String, MutableSet<String>> {
        val visitedPatternToNumberOfUniqueUsernameVisits = mutableMapOf<String, MutableSet<String>>()

        for (user in usernameToVisits.keys) {
            usernameToVisits[user]!!.sortWith { x, y -> x.timestamp - y.timestamp }
            val size = usernameToVisits[user]!!.size
            val visitedWebsites = Array<String>(NUMBER_OF_VISITED_WEBSITES_IN_PATTERN) { "" }

            for (first in 0..<size - 2) {
                visitedWebsites[0] = usernameToVisits[user]!![first].website

                for (second in first + 1..<size - 1) {
                    visitedWebsites[1] = usernameToVisits[user]!![second].website

                    for (third in second + 1..<size) {
                        visitedWebsites[2] = usernameToVisits[user]!![third].website

                        val pattern = visitedWebsites.joinToString(DELIMITER_BETWEEN_VALUES)
                        visitedPatternToNumberOfUniqueUsernameVisits.putIfAbsent(pattern, mutableSetOf<String>())
                        visitedPatternToNumberOfUniqueUsernameVisits[pattern]!!.add(user)
                    }
                }
            }
        }

        return visitedPatternToNumberOfUniqueUsernameVisits
    }

    private fun findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits: MutableMap<String, MutableSet<String>>): List<String> {
        var mostVisitedPattern = ""
        var numberOfUniqueUsernameVisits = 0

        for (pattern in visitedPatternToNumberOfUniqueUsernameVisits.keys) {
            if (visitedPatternToNumberOfUniqueUsernameVisits[pattern]!!.size < numberOfUniqueUsernameVisits) {
                continue
            }
            if (visitedPatternToNumberOfUniqueUsernameVisits[pattern]!!.size > numberOfUniqueUsernameVisits) {
                mostVisitedPattern = pattern
                numberOfUniqueUsernameVisits = visitedPatternToNumberOfUniqueUsernameVisits[pattern]!!.size
                continue
            }
            if (pattern < mostVisitedPattern) {
                mostVisitedPattern = pattern
            }
        }

        val dOne = mostVisitedPattern.indexOf(DELIMITER_BETWEEN_VALUES)
        val dTwo = mostVisitedPattern.lastIndexOf(DELIMITER_BETWEEN_VALUES)
        val dSize = DELIMITER_BETWEEN_VALUES.length

        return mutableListOf(
            mostVisitedPattern.substring(0, dOne),
            mostVisitedPattern.substring(dOne + dSize, dTwo),
            mostVisitedPattern.substring(dTwo + dSize)
        )
    }
}
