
/**
 * @param {string[]} username
 * @param {number[]} timestamp
 * @param {string[]} website
 * @return {string[]}
 */
var mostVisitedPattern = function (username, timestamp, website) {

    const usernameToVisits
            = createMapUsernameToVisits(username, timestamp, website);
    
    const visitedPatternToNumberOfUniqueUsernameVisits
            = createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits);

    return findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits);
};

/**
 * @param {string[]} username
 * @param {number[]} timestamp
 * @param {string[]} website
 * @return {Map<string, Array<Visit>>}
 */
function createMapUsernameToVisits(username, timestamp, website) {
    const usernameToVisits = new Map();
    for (let i = 0; i < username.length; ++i) {
        if (!usernameToVisits.has(username[i])) {
            usernameToVisits.set(username[i], new Array());
        }
        usernameToVisits.get(username[i]).push(new Visit(website[i], timestamp[i]));
    }
    return usernameToVisits;
}

/**
 * @param {Map<string, Array<Visit>>} usernameToVisits
 * @return {Map<string, Set<string>>} 
 */
function createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits) {
    const visitedPatternToNumberOfUniqueUsernameVisits = new Map();

    for (let user of usernameToVisits.keys()) {

        usernameToVisits.get(user).sort((x, y) => x.timestamp - y.timestamp);
        const size = usernameToVisits.get(user).length;
        const visitedWebsites = new Array(Utils.NUMBER_OF_VISITED_WEBSITES_IN_PATTERN);

        for (let first = 0; first < size - 2; ++first) {
            visitedWebsites[0] = usernameToVisits.get(user)[first].website;

            for (let second = first + 1; second < size - 1; ++second) {
                visitedWebsites[1] = usernameToVisits.get(user)[second].website;

                for (let third = second + 1; third < size; ++third) {
                    visitedWebsites[2] = usernameToVisits.get(user)[third].website;

                    const pattern = visitedWebsites.join(Utils.DELIMITER_BETWEEN_VALUES);
                    if (!visitedPatternToNumberOfUniqueUsernameVisits.has(pattern)) {
                        visitedPatternToNumberOfUniqueUsernameVisits.set(pattern, new Set());
                    }

                    visitedPatternToNumberOfUniqueUsernameVisits.get(pattern).add(user);
                }
            }
        }
    }

    return visitedPatternToNumberOfUniqueUsernameVisits;
}

/**
 * @param {Map<string, Set<string>>} visitedPatternToNumberOfUniqueUsernameVisits
 * @return {string[]} 
 */
function findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits) {
    let mostVisitedPattern = "";
    let numberOfUniqueUsernameVisits = 0;

    for (let pattern of visitedPatternToNumberOfUniqueUsernameVisits.keys()) {
        if (visitedPatternToNumberOfUniqueUsernameVisits.get(pattern).size < numberOfUniqueUsernameVisits) {
            continue;
        }
        if (visitedPatternToNumberOfUniqueUsernameVisits.get(pattern).size > numberOfUniqueUsernameVisits) {
            mostVisitedPattern = pattern;
            numberOfUniqueUsernameVisits = visitedPatternToNumberOfUniqueUsernameVisits.get(pattern).size;
            continue;
        }
        if (pattern.localeCompare(mostVisitedPattern) < 0) {
            mostVisitedPattern = pattern;
        }
    }

    const dOne = mostVisitedPattern.indexOf(Utils.DELIMITER_BETWEEN_VALUES);
    const dTwo = mostVisitedPattern.lastIndexOf(Utils.DELIMITER_BETWEEN_VALUES);
    const dSize = Utils.DELIMITER_BETWEEN_VALUES.length;

    return [
        mostVisitedPattern.substring(0, dOne),
        mostVisitedPattern.substring(dOne + dSize, dTwo),
        mostVisitedPattern.substring(dTwo + dSize)
    ];
}

class Visit {

    /**
     * @param {string} website
     * @param {number} timestamp
     */
    constructor(website, timestamp) {
        this.website = website;
        this.timestamp = timestamp;
    }
}

class Utils {
    static DELIMITER_BETWEEN_VALUES = ',';
    static NUMBER_OF_VISITED_WEBSITES_IN_PATTERN = 3;
}
