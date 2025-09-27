
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Solution {

    private record Visit(String website, int timestamp){}

    private static final String DELIMITER_BETWEEN_VALUES = ",";
    private static final int NUMBER_OF_VISITED_WEBSITES_IN_PATTERN = 3;

    public List<String> mostVisitedPattern(String[] username, int[] timestamp, String[] website) {

        Map<String, List<Visit>> usernameToVisits
                = createMapUsernameToVisits(username, timestamp, website);

        Map<String, Set<String>> visitedPatternToNumberOfUniqueUsernameVisits
                = createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits);

        return findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits);
    }

    private Map<String, List<Visit>> createMapUsernameToVisits(String[] username, int[] timestamp, String[] website) {
        Map<String, List<Visit>> usernameToVisits = new HashMap<>();
        for (int i = 0; i < username.length; ++i) {
            usernameToVisits.putIfAbsent(username[i], new ArrayList<>());
            usernameToVisits.get(username[i]).add(new Visit(website[i], timestamp[i]));
        }
        return usernameToVisits;
    }

    private Map<String, Set<String>> createMapVisitedPatternToNumberOfUniqueUsernameVisits(Map<String, List<Visit>> usernameToVisits) {
        Map<String, Set<String>> visitedPatternToNumberOfUniqueUsernameVisits = new HashMap<>();

        for (String user : usernameToVisits.keySet()) {

            Collections.sort(usernameToVisits.get(user), (x, y) -> x.timestamp - y.timestamp);
            int size = usernameToVisits.get(user).size();
            String[] visitedWebsites = new String[NUMBER_OF_VISITED_WEBSITES_IN_PATTERN];

            for (int first = 0; first < size - 2; ++first) {
                visitedWebsites[0] = usernameToVisits.get(user).get(first).website;

                for (int second = first + 1; second < size - 1; ++second) {
                    visitedWebsites[1] = usernameToVisits.get(user).get(second).website;

                    for (int third = second + 1; third < size; ++third) {
                        visitedWebsites[2] = usernameToVisits.get(user).get(third).website;

                        String pattern = String.join(DELIMITER_BETWEEN_VALUES, visitedWebsites);
                        visitedPatternToNumberOfUniqueUsernameVisits.putIfAbsent(pattern, new HashSet<>());
                        visitedPatternToNumberOfUniqueUsernameVisits.get(pattern).add(user);
                    }
                }
            }
        }

        return visitedPatternToNumberOfUniqueUsernameVisits;
    }

    private List<String> findMostVisitedPattern(Map<String, Set<String>> visitedPatternToNumberOfUniqueUsernameVisits) {
        String mostVisitedPattern = "";
        int numberOfUniqueUsernameVisits = 0;

        for (String pattern : visitedPatternToNumberOfUniqueUsernameVisits.keySet()) {
            if (visitedPatternToNumberOfUniqueUsernameVisits.get(pattern).size() < numberOfUniqueUsernameVisits) {
                continue;
            }
            if (visitedPatternToNumberOfUniqueUsernameVisits.get(pattern).size() > numberOfUniqueUsernameVisits) {
                mostVisitedPattern = pattern;
                numberOfUniqueUsernameVisits = visitedPatternToNumberOfUniqueUsernameVisits.get(pattern).size();
                continue;
            }
            if (pattern.compareTo(mostVisitedPattern) < 0) {
                mostVisitedPattern = pattern;
            }
        }

        int dOne = mostVisitedPattern.indexOf(DELIMITER_BETWEEN_VALUES);
        int dTwo = mostVisitedPattern.lastIndexOf(DELIMITER_BETWEEN_VALUES);
        int dSize = DELIMITER_BETWEEN_VALUES.length();

        return List.of(
                mostVisitedPattern.substring(0, dOne),
                mostVisitedPattern.substring(dOne + dSize, dTwo),
                mostVisitedPattern.substring(dTwo + dSize));
    }
}
