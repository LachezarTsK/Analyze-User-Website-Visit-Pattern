
using System;
using System.Collections.Generic;

public class Solution
{
    private record Visit(string Website, int Timestamp) { }

    private static readonly string DELIMITER_BETWEEN_VALUES = ",";
    private static readonly int NUMBER_OF_VISITED_WEBSITES_IN_PATTERN = 3;

    public IList<string> MostVisitedPattern(string[] username, int[] timestamp, string[] website)
    {
        Dictionary<string, List<Visit>> usernameToVisits
                = CreateMapUsernameToVisits(username, timestamp, website);

        Dictionary<string, HashSet<string>> visitedPatternToNumberOfUniqueUsernameVisits
                = CreateMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits);

        return FindMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits);
    }

    private Dictionary<string, List<Visit>> CreateMapUsernameToVisits(string[] username, int[] timestamp, string[] website)
    {
        Dictionary<string, List<Visit>> usernameToVisits = [];
        for (int i = 0; i < username.Length; ++i)
        {
            usernameToVisits.TryAdd(username[i], new List<Visit>());
            usernameToVisits[username[i]].Add(new Visit(website[i], timestamp[i]));
        }
        return usernameToVisits;
    }

    private Dictionary<string, HashSet<string>> CreateMapVisitedPatternToNumberOfUniqueUsernameVisits(Dictionary<string, List<Visit>> usernameToVisits)
    {
        Dictionary<string, HashSet<string>> visitedPatternToNumberOfUniqueUsernameVisits = [];

        foreach (string user in usernameToVisits.Keys)
        {
            usernameToVisits[user].Sort((x, y) => x.Timestamp - y.Timestamp);
            int size = usernameToVisits[user].Count;
            string[] visitedWebsites = new string[NUMBER_OF_VISITED_WEBSITES_IN_PATTERN];

            for (int first = 0; first < size - 2; ++first)
            {
                visitedWebsites[0] = usernameToVisits[user][first].Website;

                for (int second = first + 1; second < size - 1; ++second)
                {
                    visitedWebsites[1] = usernameToVisits[user][second].Website;

                    for (int third = second + 1; third < size; ++third)
                    {
                        visitedWebsites[2] = usernameToVisits[user][third].Website;

                        string pattern = string.Join(DELIMITER_BETWEEN_VALUES, visitedWebsites);
                        visitedPatternToNumberOfUniqueUsernameVisits.TryAdd(pattern, new HashSet<string>());
                        visitedPatternToNumberOfUniqueUsernameVisits[pattern].Add(user);
                    }
                }
            }
        }

        return visitedPatternToNumberOfUniqueUsernameVisits;
    }

    private IList<string> FindMostVisitedPattern(Dictionary<string, HashSet<string>> visitedPatternToNumberOfUniqueUsernameVisits)
    {
        string mostVisitedPattern = "";
        int numberOfUniqueUsernameVisits = 0;

        foreach (string pattern in visitedPatternToNumberOfUniqueUsernameVisits.Keys)
        {
            if (visitedPatternToNumberOfUniqueUsernameVisits[pattern].Count < numberOfUniqueUsernameVisits)
            {
                continue;
            }
            if (visitedPatternToNumberOfUniqueUsernameVisits[pattern].Count > numberOfUniqueUsernameVisits)
            {
                mostVisitedPattern = pattern;
                numberOfUniqueUsernameVisits = visitedPatternToNumberOfUniqueUsernameVisits[pattern].Count;
                continue;
            }
            if (pattern.CompareTo(mostVisitedPattern) < 0)
            {
                mostVisitedPattern = pattern;
            }
        }

        int dOne = mostVisitedPattern.IndexOf(DELIMITER_BETWEEN_VALUES);
        int dTwo = mostVisitedPattern.LastIndexOf(DELIMITER_BETWEEN_VALUES);
        int dSize = DELIMITER_BETWEEN_VALUES.Length;

        return [
                mostVisitedPattern.Substring(0, dOne),
                mostVisitedPattern.Substring(dOne + dSize, dTwo - dOne - dSize),
                mostVisitedPattern.Substring(dTwo + dSize)
               ];
    }
}
