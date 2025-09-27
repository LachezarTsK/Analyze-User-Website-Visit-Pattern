
#include <string>
#include <vector>
#include <ranges>
#include <unordered_set>
#include <unordered_map>
using namespace std;

class Solution {

    struct Visit {
            string website{};
            int timestamp{};

            Visit() = default;
            Visit(string website, int timestamp) :website{ website }, timestamp{ timestamp } {};
    };

    inline static const string DELIMITER_BETWEEN_VALUES = ",";
    static const int NUMBER_OF_VISITED_WEBSITES_IN_PATTERN = 3;

public:
    vector<string> mostVisitedPattern(vector<string>& username, vector<int>& timestamp, vector<string>& website) const {

            unordered_map<string, vector<Visit>> usernameToVisits 
                    = createMapUsernameToVisits(username, timestamp, website);

            unordered_map<string, unordered_set<string>> visitedPatternToNumberOfUniqueUsernameVisits
                    = createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits);

            return findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits);
    }

private:
    unordered_map<string, vector<Visit>> createMapUsernameToVisits(vector<string>& username, vector<int>& timestamp, vector<string>& website) const {
            unordered_map<string, vector<Visit>> usernameToVisits;
            for (int i = 0; i < username.size(); ++i) {
                    usernameToVisits[username[i]].emplace_back(website[i], timestamp[i]);
            }
            return usernameToVisits;
    }

    unordered_map<string, unordered_set<string>> createMapVisitedPatternToNumberOfUniqueUsernameVisits(unordered_map<string, vector<Visit>>& usernameToVisits) const {
        unordered_map<string, unordered_set<string>> visitedPatternToNumberOfUniqueUsernameVisits;

        for (auto& [user, visits] : usernameToVisits) {

            ranges::sort(usernameToVisits[user], [](const Visit& x, const Visit& y) {return x.timestamp < y.timestamp; });
            int size = usernameToVisits[user].size();
            vector<string> visitedWebsites(NUMBER_OF_VISITED_WEBSITES_IN_PATTERN);

            for (int first = 0; first < size - 2; ++first) {
                visitedWebsites[0] = usernameToVisits[user][first].website;

                for (int second = first + 1; second < size - 1; ++second) {
                    visitedWebsites[1] = usernameToVisits[user][second].website;

                    for (int third = second + 1; third < size; ++third) {
                        visitedWebsites[2] = usernameToVisits[user][third].website;

                        string pattern = visitedWebsites[0] + "," + visitedWebsites[1] + "," + visitedWebsites[2];
                        visitedPatternToNumberOfUniqueUsernameVisits[pattern].insert(user);
                    }
                }
            }
        }

        return visitedPatternToNumberOfUniqueUsernameVisits;
    }

    vector<string> findMostVisitedPattern(unordered_map<string, unordered_set<string>>& visitedPatternToNumberOfUniqueUsernameVisits) const {
        string mostVisitedPattern;
        int numberOfUniqueUsernameVisits = 0;

        for (const auto& [pattern, numberOfVisits] : visitedPatternToNumberOfUniqueUsernameVisits) {
            if (numberOfVisits.size() < numberOfUniqueUsernameVisits) {
                continue;
            }
            if (numberOfVisits.size() > numberOfUniqueUsernameVisits) {
                mostVisitedPattern = pattern;
                numberOfUniqueUsernameVisits = numberOfVisits.size();
                continue;
            }
            if (pattern < mostVisitedPattern) {
                mostVisitedPattern = pattern;
            }
        }

        int dOne = mostVisitedPattern.find_first_of(DELIMITER_BETWEEN_VALUES);
        int dTwo = mostVisitedPattern.find_last_of(DELIMITER_BETWEEN_VALUES);
        int dSize = DELIMITER_BETWEEN_VALUES.length();

        return {
                mostVisitedPattern.substr(0, dOne),
                mostVisitedPattern.substr(dOne + dSize, dTwo - dOne - dSize),
                mostVisitedPattern.substr(dTwo + dSize)
               };
    }
};
