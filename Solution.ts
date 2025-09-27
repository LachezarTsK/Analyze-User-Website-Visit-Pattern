
function mostVisitedPattern(username: string[], timestamp: number[], website: string[]): string[] {

    const usernameToVisits: Map<string, Array<Visit>>
        = createMapUsernameToVisits(username, timestamp, website);

    const visitedPatternToNumberOfUniqueUsernameVisits: Map<string, Set<string>>
        = createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits);

    return findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits);
};

function createMapUsernameToVisits(username: string[], timestamp: number[], website: string[]): Map<string, Array<Visit>> {
    const usernameToVisits = new Map<string, Array<Visit>>();
    for (let i = 0; i < username.length; ++i) {
        if (!usernameToVisits.has(username[i])) {
            usernameToVisits.set(username[i], new Array());
        }
        usernameToVisits.get(username[i]).push(new Visit(website[i], timestamp[i]));
    }
    return usernameToVisits;
}

function createMapVisitedPatternToNumberOfUniqueUsernameVisits(usernameToVisits: Map<string, Array<Visit>>): Map<string, Set<string>> {
    const visitedPatternToNumberOfUniqueUsernameVisits = new Map<string, Set<string>>();

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

function findMostVisitedPattern(visitedPatternToNumberOfUniqueUsernameVisits: Map<string, Set<string>>): string[] {
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

    website: string;
    timestamp: number;

    constructor(website: string, timestamp: number) {
        this.website = website;
        this.timestamp = timestamp;
    }
}

class Utils {
    static DELIMITER_BETWEEN_VALUES = ',';
    static NUMBER_OF_VISITED_WEBSITES_IN_PATTERN = 3;
}
